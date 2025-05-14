function registerStudent() {
  const id = document.getElementById("studentId").value.trim();
  const name = document.getElementById("studentName").value.trim();

  if (!id || !name) return alert("Fill all fields");

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  if (students.find(s => s.id === id)) {
    alert("Student already registered!");
    return;
  }

  students.push({ id, name });
  localStorage.setItem("students", JSON.stringify(students));
  alert("Student registered!");
  document.getElementById("studentId").value = "";
  document.getElementById("studentName").value = "";
  showStudentsForAttendance();
}

function showStudentsForAttendance() {
  const month = document.getElementById("monthSelect").value;
  const container = document.getElementById("studentList");
  container.innerHTML = "";

  if (!month) return;

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  students.forEach(student => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${student.name} (${student.id})</label>
      <select id="att-${student.id}">
        <option value="P">Present</option>
        <option value="A">Absent</option>
      </select><br>
    `;
    container.appendChild(div);
  });
}

document.getElementById("monthSelect").addEventListener("change", showStudentsForAttendance);

function saveAttendance() {
  const month = document.getElementById("monthSelect").value;
  if (!month) return alert("Select a month first!");

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  let attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

  if (!attendance[month]) attendance[month] = {};

  students.forEach(student => {
    const status = document.getElementById(`att-${student.id}`).value;
    if (!attendance[month][student.id]) attendance[month][student.id] = [];
    attendance[month][student.id].push(status);
  });

  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Attendance saved!");
}

function viewAttendance() {
  const id = document.getElementById("loginId").value.trim();
  const month = document.getElementById("studentMonthSelect").value;
  const resultDiv = document.getElementById("attendanceResult");

  if (!id || !month) return alert("Enter ID and select a month!");

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students.find(s => s.id === id);

  if (!student) return alert("Student not found!");

  const attendance = JSON.parse(localStorage.getItem("attendance") || "{}");
  const records = attendance[month]?.[id] || [];

  const presentDays = records.filter(r => r === "P").length;
  const totalDays = records.length;
  const percentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : "0";

  resultDiv.innerHTML = `
    <p><strong>${student.name}</strong> (${id})</p>
    <p>Month: ${month}</p>
    <p>Present: ${presentDays} / ${totalDays}</p>
    <p><strong>Attendance: ${percentage}%</strong></p>
  `;
}
