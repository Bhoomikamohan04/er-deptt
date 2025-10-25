import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseclient } from "./Config/supabase";
import {
  ArrowLeft,
  Send,
  Undo,
  Redo,
  Eraser,
  Pen,
  Trash2,
  Type,
  User,
  Calendar,
  Hash,
  Stethoscope,
  UserCircle,
  FileText
} from "lucide-react";
import { useToast } from "../Context/ToastContext";

const PatientFormPage = () => {
  const { mrno } = useParams();
  const navigate = useNavigate();
  const { success, error: showError, info } = useToast();

  // Patient data state
  const [patient, setPatient] = useState({
    name: "",
    mrno: mrno,
    dob: "",
    age: "",
    gender: "",
    consultant: "",
    aadhaar: "",
    address: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(3);
  
  // Text tool states
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  // Use refs for smooth handwriting without React re-renders
  const lastX = useRef(0);
  const lastY = useRef(0);
  const isDrawingRef = useRef(false);
  const lastDrawTime = useRef(0);
  const startTime = useRef(0);
  const startX = useRef(0);
  const startY = useRef(0);

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // UI States
  const [imageLoaded, setImageLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preset colors
  const presetColors = [
    "#000000",
    "#ff0000",
    "#0000ff",
    "#00ff00",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff8800",
  ];

  const [selectedForms, setSelectedForms] = useState([]);
  const [activeForm, setActiveForm] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        console.log("Fetching patient data for MR No:", mrno);
        
        // First try to fetch from patients table
        let { data, error } = await supabaseclient
          .from("patients")
          .select("*")
          .eq("mrno", mrno)
          .single();

        // If not found in patients table, try users table
        if (error || !data) {
          console.log("Patient not found in 'patients' table, trying 'users' table");
          const usersResult = await supabaseclient
            .from("users")
            .select("*")
            .eq("mrno", mrno)
            .single();
          
          if (usersResult.error) throw usersResult.error;
          data = usersResult.data;
        }

        console.log("Fetched patient data:", data);
        
        if (data) {
          // Calculate age from DOB if available
          let age = '';
          if (data.dob) {
            const birthDate = new Date(data.dob);
            if (!isNaN(birthDate.getTime())) {
              const today = new Date();
              let calculatedAge = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
              }
              age = calculatedAge.toString();
            }
          }
          
          setPatient({
            name: data.name || data.full_name || "",
            mrno: data.mrno || "",
            dob: data.dob ? new Date(data.dob).toLocaleDateString() : "",
            age: age,
            gender: data.gender || "",
            consultant: data.consultant || data.doctor || "Dr. Smith"
          });
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
        showError("Failed to load patient details. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };

    if (mrno) {
      fetchPatient();
    } else {
      console.error("No MR Number provided in URL");
      showError("No patient MR number provided");
      setLoading(false);
    }
  }, [mrno, showError]);

  // Load all forms
  useEffect(() => {
    const allForms = [
      "ACTIVITY CHART FOR BILLING(1 of 10)",
      "ACTIVITY CHART FOR BILLING(2 of 10)",
      "ACTIVITY CHART FOR BILLING(3 of 10)",
      "ACTIVITY CHART FOR BILLING(4 of 10)",
      "ACTIVITY CHART FOR BILLING(5 of 10)",
      "ACTIVITY CHART FOR BILLING(6 of 10)",
      "ACTIVITY CHART FOR BILLING(7 of 10)",
      "ACTIVITY CHART FOR BILLING(8 of 10)",
      "ACTIVITY CHART FOR BILLING(9 of 10)",
      "ACTIVITY CHART FOR BILLING(10 of 10)",
      "ADMISSION CONSENT",
      "ADMISSION CONSENT KANNADA",
      "CARE BUNDLE CHECK LIST (1)",
      "CATHLAB HIGH RISK CONSENT FORM (2)",
      "CONSENT FOR ADMISSION TO ICU & NICU & PICU",
      "CONSENT FOR ANESTHESIA & SEDATION",
      "CONSENT FOR ANESTHESIA & SEDATION KANNADA",
      "CONSENT FOR CAG (1)",
      "CONSENT FOR CAG (2)",
      "CONSENT FOR CAG (PART B) -3",
      "CONSENT FOR CAG (PART B) -4",
      "CONSENT FOR HAEMODIALYSIS",
      "CONSENT FOR HAEMODIALYSIS KANNADA",
      "CONSENT FOR HIV TESTING",
      "CONSENT FOR HIV TESTING KANNADA",
      "CONSENT FOR RADIOLOGY - CT SCAN",
      "CONSENT FOR RADIOLOGY - CT SCAN KANNADA",
      "CONSENT FOR REFUSAL TREATMENT",
      "CONSENT FOR REFUSAL TREATMENT KANNADA",
      "CONSENT FOR SURGERY & PROCEDURES (1)",
      "CONSENT FOR SURGERY & PROCEDURES (2)",
      "CONSENT FORM FOR MTP",
      "CONSENT FORM FOR MTP KANNADA",
      "DIABETIC MONITORING CHART",
      "ER DEPARTMENT INITIAL ASSESSMENT",
      "ER DOCTOR INITIAL ASSESSMENT (1)",
      "ER DOCTOR INITIAL ASSESSMENT (2)",
      "HIGH RISK CONSENT",
      "HIGH RISK CONSENT FORM (CARDIAC)",
      "HIGH RISK CONSENT FORM (CARDIAC) KANNADA",
      "INFORMED CONSENT FOR SURGERY & PROCEDURE (1 OF 2)",
      "INFORMED CONSENT FOR SURGERY & PROCEDURE (2 OF 2)",
      "INTAKE OUTPUT CHART",
      "LAB INVESTIGATION CHART",
      "LAPROSCOPY CONSENT",
      "LAPROSCOPY CONSENT KANNADA",
      "MEDICATION CHART (1)",
      "MEDICATION CHART (2)",
      "NURSES NOTES",
      "PRE-OPERATIVE CHECK LIST FOR NURSES",
      "SURGERY CONSENT PROCEDURE (1 OF 3) KANNADA",
      "SURGERY CONSENT PROCEDURE (2 OF 3) KANNADA",
      "SURGERY CONSENT PROCEDURE (3 OF 3) KANNADA",
      "TPR CHART (1)",
      "TPR CHART (2)",
      "TPR CHART (3)",
    ];

    const formFiles = allForms.map((formName) => ({
      name: formName,
      url: `/Forms/${formName}.jpg`,
    }));

    setSelectedForms(formFiles);

    // Set default form
    const defaultForm = formFiles[0];
    setActiveForm(defaultForm);
  }, []);

  // Initialize canvas when form changes
  useEffect(() => {
    if (imageLoaded && activeForm) {
      setupCanvas();
    }
  }, [activeForm, imageLoaded]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!image || !image.complete || !canvas) return;

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");
    
    // Optimized settings for smooth handwriting
    context.lineCap = "round";
    context.lineJoin = "round";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high"; // Back to high for smoothness
    
    setCtx(context);

    // Reset history
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryStep(0);
  };

  const getCanvasState = () => {
    if (!ctx || !canvasRef.current) return null;
    return ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveHistory = () => {
    const state = getCanvasState();
    if (!state) return;

    const updatedHistory = history.slice(0, historyStep + 1);
    setHistory([...updatedHistory, state]);
    setHistoryStep((prev) => prev + 1);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    
    // Handle text tool
    if (tool === "text") {
      setTextPosition({ x, y });
      setShowTextDialog(true);
      return;
    }
    
    setDrawing(true);
    isDrawingRef.current = true;
    
    // Store starting position and time for dot detection
    startX.current = x;
    startY.current = y;
    startTime.current = Date.now();
    lastX.current = x;
    lastY.current = y;
    
    // Set up drawing context once
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = lineWidth * 3;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    // Start continuous path for handwriting
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing || !ctx || !isDrawingRef.current) return;

    const now = Date.now();
    // Keep fast throttling (every 6ms = ~166fps)
    if (now - lastDrawTime.current < 6) return;
    
    const { x, y } = getCoordinates(e);
    
    // Calculate distance for smoothness adjustment
    const distance = Math.sqrt((x - lastX.current) ** 2 + (y - lastY.current) ** 2);
    
    if (distance > 1) {
      // For fast movements, use midpoint for smoother curves
      const midX = (lastX.current + x) / 2;
      const midY = (lastY.current + y) / 2;
      ctx.quadraticCurveTo(lastX.current, lastY.current, midX, midY);
      ctx.stroke();
      
      // Start new path for next curve
      ctx.beginPath();
      ctx.moveTo(midX, midY);
    }
    
    // Update last position
    lastX.current = x;
    lastY.current = y;
    lastDrawTime.current = now;
  };

  const stopDrawing = () => {
    if (drawing) {
      const now = Date.now();
      const duration = now - startTime.current;
      const distance = Math.sqrt((lastX.current - startX.current) ** 2 + (lastY.current - startY.current) ** 2);
      
      // Detect dots: short duration and small movement
      if (duration < 200 && distance < 5) {
        // Draw a dot for single clicks/taps with selected color
        ctx.beginPath();
        ctx.arc(startX.current, startY.current, lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      
      ctx.closePath();
      saveHistory();
      isDrawingRef.current = false;
    }
    setDrawing(false);
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const step = historyStep - 1;
    ctx.putImageData(history[step], 0, 0);
    setHistoryStep(step);
    info("Undone");
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const step = historyStep + 1;
    ctx.putImageData(history[step], 0, 0);
    setHistoryStep(step);
    info("Redone");
  };

  const clearCanvas = () => {
    if (!ctx) return;
    if (window.confirm("Clear all annotations? This cannot be undone.")) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveHistory();
      success("Canvas cleared");
    }
  };

  const addTextToCanvas = () => {
    if (!ctx || !textInput.trim()) return;
    
    // Set text properties
    ctx.font = `${lineWidth * 4}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Draw text at the position
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    // Save to history
    saveHistory();
    
    // Close dialog and reset
    setShowTextDialog(false);
    setTextInput("");
    success("Text added to form");
  };

  const cancelTextDialog = () => {
    setShowTextDialog(false);
    setTextInput("");
  };

  const mergeCanvasWithImage = () => {
    const tempCanvas = document.createElement("canvas");
    const image = imageRef.current;

    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw form image
    tempCtx.drawImage(image, 0, 0);

    // Draw annotations
    tempCtx.drawImage(canvasRef.current, 0, 0);

    return tempCanvas;
  };

  const saveAsPNG = async () => {
    if (!activeForm) {
      showError("Please select a form first");
      return;
    }

    try {
      setSaving(true);
      const mergedCanvas = mergeCanvasWithImage();
      const link = document.createElement("a");
      const fileName = `${patient.name.replace(/\s+/g, "_")}_${activeForm.name.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.download = fileName;
      link.href = mergedCanvas.toDataURL("image/png");
      link.click();

      success("Form saved as PNG!");
    } catch (err) {
      showError("Failed to save PNG");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveAsPDF = async () => {
    if (!activeForm) {
      showError("Please select a form first");
      return;
    }

    try {
      setSaving(true);
      const mergedCanvas = mergeCanvasWithImage();
      const imgData = mergedCanvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (mergedCanvas.height * imgWidth) / mergedCanvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Add patient details as text
      pdf.setFontSize(10);
      pdf.text(`Patient: ${patient.name}`, 10, imgHeight + 10);
      pdf.text(`MR No: ${patient.mrno}`, 10, imgHeight + 15);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, imgHeight + 20);

      const fileName = `${patient.name.replace(/\s+/g, "_")}_${activeForm.name.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      success("Form saved as PDF!");
    } catch (err) {
      showError("Failed to save PDF");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const sendToWhatsApp = async () => {
    if (!activeForm) {
      showError("Please select a form first");
      return;
    }

    try {
      setSaving(true);

      const message = `Hi ${patient.name}, your ${activeForm.name} is ready. MR No: ${patient.mrno}`;
      const whatsappUrl = `https://wa.me/${patient.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");
      success("Opening WhatsApp...");
    } catch (err) {
      showError("Failed to send to WhatsApp");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const printForm = () => {
    if (!activeForm) {
      showError("Please select a form first");
      return;
    }

    const mergedCanvas = mergeCanvasWithImage();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeForm.name} - ${patient.name}</title>
          <style>
            body { margin: 0; padding: 20px; }
            img { max-width: 100%; height: auto; }
            .info { margin-bottom: 20px; font-family: Arial; }
          </style>
        </head>
        <body>
          <div class="info">
            <h2>${activeForm.name}</h2>
            <p><strong>Patient:</strong> ${patient.name}</p>
            <p><strong>MR No:</strong> ${patient.mrno}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <img src="${mergedCanvas.toDataURL()}" />
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  // Touch event handlers
  const getTouchCoordinates = (touch) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (!ctx) return;
    
    // Palm rejection: ignore multi-touch
    if (e.touches.length > 1) return;
    
    const { x, y } = getTouchCoordinates(e.touches[0]);
    
    // Handle text tool
    if (tool === "text") {
      setTextPosition({ x, y });
      setShowTextDialog(true);
      return;
    }
    
    setDrawing(true);
    isDrawingRef.current = true;
    
    // Store starting position and time for dot detection
    startX.current = x;
    startY.current = y;
    startTime.current = Date.now();
    lastX.current = x;
    lastY.current = y;
    
    // Set up drawing context once
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = lineWidth * 3;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    // Start continuous path for handwriting
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!drawing || !ctx || !isDrawingRef.current) return;
    
    // Palm rejection: ignore multi-touch
    if (e.touches.length > 1) return;
    
    const now = Date.now();
    // Keep fast throttling (every 6ms = ~166fps)
    if (now - lastDrawTime.current < 6) return;
    
    const { x, y } = getTouchCoordinates(e.touches[0]);
    
    // Calculate distance for smoothness adjustment
    const distance = Math.sqrt((x - lastX.current) ** 2 + (y - lastY.current) ** 2);
    
    if (distance > 1) {
      // For fast movements, use midpoint for smoother curves
      const midX = (lastX.current + x) / 2;
      const midY = (lastY.current + y) / 2;
      ctx.quadraticCurveTo(lastX.current, lastY.current, midX, midY);
      ctx.stroke();
      
      // Start new path for next curve
      ctx.beginPath();
      ctx.moveTo(midX, midY);
    }
    
    // Update last position
  lastX.current = x;
  lastY.current = y;
  lastDrawTime.current = now;
}

            {/* Undo/Redo */}
            <div className="flex gap-2 border-r border-slate-200 pr-4">
              <button
                onClick={undo}
                disabled={historyStep <= 0}
                className="p-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                className="p-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>

            {/* Clear */}
            <button
              onClick={clearCanvas}
              disabled={!ctx}
              className="p-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors disabled:opacity-50"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        {activeForm ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 w-full max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto">
            <div className="relative inline-block max-w-full overflow-auto">
              <img
                ref={imageRef}
                src={activeForm.url}
                alt={activeForm.name}
                className="block max-w-full h-auto"
                onLoad={() => {
                  setImageLoaded(true);
                }}
                onError={() => {
                  showError(`Failed to load form: ${activeForm.name}`);
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 cursor-crosshair touch-none select-none"
                style={{ 
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none"
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 border border-slate-100 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Form Selected</h3>
            <p className="text-slate-500">
              Please select a form template from the dropdown above to get started.
            </p>
          </div>
        )}

      </div>
      
      {/* Text Input Dialog */}
      {showTextDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Text</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter text to add to the form:
              </label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your text here..."
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addTextToCanvas}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
              <button
                onClick={cancelTextDialog}
                className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientFormPage;
