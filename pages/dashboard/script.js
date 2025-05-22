const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 20,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Computadores por Aluno
new Chart(document.getElementById("chartComputadoresAluno"), {
  type: "bar",
  data: {
    labels: ["Urbana", "Rural"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderWidth: 0,
      },
    ],
  },
  options: chartOptions,
});

// Computadores Administrativos
new Chart(document.getElementById("chartComputadoresAdmin"), {
  type: "bar",
  data: {
    labels: ["Urbana", "Rural"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderWidth: 0,
      },
    ],
  },
  options: chartOptions,
});

// Gráfico IDEB
new Chart(document.getElementById("chartIdeb"), {
  type: "line",
  data: {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "IDEB",
        data: [4.2, 4.5, 4.7, 5.0, 5.2, 5.4, 5.6],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: chartOptions,
});

// Gráfico Matrículas
new Chart(document.getElementById("chartMatriculas"), {
  type: "line",
  data: {
    labels: ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"],
    datasets: [
      {
        label: "Matrículas",
        data: [1200, 1150, 1100, 1050, 1000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: chartOptions,
});
