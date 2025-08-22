const API_URL = "http://localhost:3000/api/forms";

const formList = document.getElementById("formList");
const createForm = document.getElementById("createForm");
const dynamicForm = document.getElementById("dynamicForm");
const selectedFormName = document.getElementById("selectedFormName");
const recordsHeader = document.getElementById("recordsHeader");
const recordsTable = document.getElementById("recordsTable");

let currentForm = null;

/** Cargar todos los formularios */
async function loadForms() {
  try {
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const forms = await res.json();
    
    // Verifica que forms sea un array
    if (!Array.isArray(forms)) {
      console.error("Expected array but got:", forms);
      formList.innerHTML = "<li class='list-group-item text-danger'>Error: El servidor no devolvió datos válidos</li>";
      return;
    }
    
    formList.innerHTML = "";
    
    if (forms.length === 0) {
      formList.innerHTML = "<li class='list-group-item'>No hay formularios creados</li>";
      return;
    }
    
    forms.forEach(f => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span><strong>${f.name}</strong> - ${f.description || ""}</span>
        <button class="btn btn-sm btn-outline-primary">Seleccionar</button>
      `;
      li.querySelector("button").addEventListener("click", () => selectForm(f));
      formList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading forms:", error);
    formList.innerHTML = `<li class="list-group-item text-danger">Error al cargar formularios: ${error.message}</li>`;
  }
}
/** Crear un nuevo formulario */
/** Crear un nuevo formulario con manejo de errores */
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    const name = document.getElementById("formName").value;
    const description = document.getElementById("formDescription").value;
    const schema = JSON.parse(document.getElementById("formSchema").value);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, schema })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    createForm.reset();
    loadForms();
  } catch (error) {
    console.error("Error creating form:", error);
    alert(`Error al crear formulario: ${error.message}`);
  }
});

/** Seleccionar un formulario y renderizarlo */
async function selectForm(form) {
  currentForm = form;
  selectedFormName.textContent = form.name;
  dynamicForm.innerHTML = "";

  form.schema.fields.forEach(field => {
    const div = document.createElement("div");
    div.className = "mb-3";
    div.innerHTML = `
      <label class="form-label">${field.label}</label>
      <input type="${field.type}" name="${field.name}" class="form-control" ${field.required ? "required" : ""}>
    `;
    dynamicForm.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.type = "submit";
  btn.className = "btn btn-success";
  btn.textContent = "Registrar";
  dynamicForm.appendChild(btn);

  dynamicForm.onsubmit = saveResponse;

  loadResponses(form.id);
}

/** Guardar respuesta de formulario */
async function saveResponse(e) {
  e.preventDefault();
  const formData = new FormData(dynamicForm);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));

  await fetch(`${API_URL}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId: currentForm.id, data })
  });

  loadResponses(currentForm.id);
  dynamicForm.reset();
}

/** Cargar respuestas de un formulario */
async function loadResponses(templateId) {
  const res = await fetch(`${API_URL}/${templateId}/responses`);
  const responses = await res.json();

  if (responses.length === 0) {
    recordsHeader.innerHTML = "";
    recordsTable.innerHTML = "<tr><td colspan='10'>No hay registros</td></tr>";
    return;
  }

  // Cabeceras dinámicas
  recordsHeader.innerHTML = "";
  Object.keys(responses[0].data).forEach(key => {
    const th = document.createElement("th");
    th.textContent = key;
    recordsHeader.appendChild(th);
  });

  // Filas
  recordsTable.innerHTML = "";
  responses.forEach(r => {
    const tr = document.createElement("tr");
    Object.values(r.data).forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    recordsTable.appendChild(tr);
  });
}

// Inicializar
loadForms();
