const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

// Computadores por Aluno
new Chart(document.getElementById("chartComputadoresAluno"), {
  type: "bar",
  data: {
    labels: ["Público", "Privado"],
    datasets: [{ data: [3.2, 2.4], backgroundColor: ["#3B82F6", "#EC4899"] }],
  },
  options: { ...commonOptions, scales: { y: { beginAtZero: true } } },
});

// Computadores Administrativos
new Chart(document.getElementById("chartComputadoresAdmin"), {
  type: "doughnut",
  data: {
    labels: ["Em uso", "Ociosos"],
    datasets: [{ data: [70, 30], backgroundColor: ["#3B82F6", "#EC4899"] }],
  },
  options: { ...commonOptions, cutout: "60%" },
});

// Rendimento Escolar
new Chart(document.getElementById("chartRendimento"), {
  type: "line",
  data: {
    labels: ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"],
    datasets: [
      {
        label: "Abandono",
        data: [10, 7, 8, 9, 8],
        fill: true,
        backgroundColor: "rgba(59,130,246,0.3)",
        borderColor: "#3B82F6",
        tension: 0.4,
      },
      {
        label: "Aprovação",
        data: [12, 10, 11, 13, 11],
        fill: true,
        backgroundColor: "rgba(236,73,153,0.3)",
        borderColor: "#EC4899",
        tension: 0.4,
      },
    ],
  },
  options: {
    ...commonOptions,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
  },
});

new Chart(document.getElementById("chartDistorsao"), {
  type: "line",
  data: {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    datasets: [
      {
        label: "Fundamental",
        data: [15, 18, 14, 20, 22, 19, 25],
        borderColor: "#3B82F6",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Médio",
        data: [10, 12, 9, 14, 16, 13, 18],
        borderColor: "#EC4899",
        fill: false,
        tension: 0.3,
      },
    ],
  },
  options: { ...commonOptions, scales: { y: { beginAtZero: true } } },
});
