document.addEventListener('DOMContentLoaded', function() {
  // 1) Pega os selects
  var yearSel  = document.querySelector('.flex select:nth-of-type(1)');
  var cicloSel = document.querySelector('.flex select:nth-of-type(2)');
  var redeSel  = document.querySelector('.flex select:nth-of-type(3)');

  // 2) Mapas para ciclo e rede
  var cicloMap = { 'Anos Iniciais': 'EF1', 'Anos Finais': 'EF2', 'Ensino Médio': 'EM' };
  var redeMap  = { 'Municipal': 'MUNICIPAL', 'Estadual': 'ESTADUAL', 'Federal': 'FEDERAL' };

  // 3) Inicializa os 5 gráficos nos canvas já existentes
  function makeChart(id, type, opts) {
    var ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, Object.assign({
      type: type,
      data: { labels: [], datasets: [] },
      options: { responsive: true }
    }, opts));
  }

  var chartAluno  = makeChart('chartComputadoresAluno',   'bar',  { data: { datasets: [{ label: 'Zona Urbana', backgroundColor: '#3B82F6', data: [] }, { label: 'Zona Rural', backgroundColor: '#60A5FA', data: [] }] } });
  var chartAdmin  = makeChart('chartComputadoresAdmin',   'doughnut', { data: { labels: ['Zona Urbana','Zona Rural'], datasets: [{ backgroundColor: ['#10B981','#6EE7B7'], data: [] }] } });
  var chartRend   = makeChart('chartRendimento',          'line', { options: { scales: { y: { beginAtZero:true, max:100 } } }, data: { datasets: [
    { label: 'Abandono', fill: true, backgroundColor: 'rgba(59,130,246,0.3)', borderColor:'#3B82F6', data: [] },
    { label: 'Aprovação', fill: true, backgroundColor: 'rgba(16,185,129,0.3)', borderColor:'#10B981', data: [] }
  ] }});
  var chartIdeb   = makeChart('myChart',                  'bar',  { data: { datasets: [{ label: 'IDEB', backgroundColor: '#F59E0B', data: [] }] }, options:{ scales:{ y:{ beginAtZero:true } } } });
  var chartMat    = makeChart('chartDistorsao',           'bar',  { data: { datasets: [{ label: 'Matrículas', backgroundColor: '#EF4444', data: [] }] }, options:{ scales:{ y:{ beginAtZero:true } } } });

  // 4) Funções que buscam e atualizam cada um
  function updateComputadores() {
    var urlA = '/api/computadores-aluno'
      + '?ano=' + yearSel.value
      + '&ciclo=' + cicloMap[cicloSel.value]
      + '&rede='  + redeMap[redeSel.value];
    axios.get(urlA).then(function(r){
      var d = r.data; // [ { zona:'Urbana', valor:0.8 }, ... ]
      chartAluno.data.labels = d.map(o=>o.escola || o.zona);
      chartAluno.data.datasets[0].data = d.map(o=>o.urbana);
      chartAluno.data.datasets[1].data = d.map(o=>o.rural);
      chartAluno.update();
    });

    var urlB = '/api/computadores-admin'
      + '?ano=' + yearSel.value
      + '&ciclo=' + cicloMap[cicloSel.value]
      + '&rede='  + redeMap[redeSel.value];
    axios.get(urlB).then(function(r){
      var d = r.data; // [ { zona:'Urbana', valor:50 }, ... ]
      chartAdmin.data.datasets[0].data = [ d.find(x=>x.zona==='Urbana').valor, d.find(x=>x.zona==='Rural').valor ];
      chartAdmin.update();
    });
  }

  function updateRendimento() {
    var url = 'https://api.qedu.org.br/v1/ideb/aprovacoes'
      + '?id=2111300'
      + '&ano=' + yearSel.value
      + '&ciclo_id=' + cicloMap[cicloSel.value]
      + '&rede=' + redeMap[redeSel.value];
    axios.get(url, { headers:{ Authorization:'Bearer iYnB1spKXMnwYCN7wPZ4KoQjeqGuzHRQTiEHL8ej' }})
      .then(function(res){
        var it = res.data; // [ { serie:'1º ano', aprovacao:80, abandono:10 }, … ]
        chartRend.data.labels = it.map(x=>x.serie);
        chartRend.data.datasets[0].data = it.map(x=>x.abandono);
        chartRend.data.datasets[1].data = it.map(x=>x.aprovacao);
        chartRend.update();
      });
  }

  function updateIdebMat() {
    // *Exemplo estático* — só para você ver o layout.
    // É só trocar por axios.get('/api/ideb?...') se você tiver um endpoint
    var anos  = ['1º ano','2º ano','3º ano','4º ano','5º ano'];
    var ideb  = [4.2, 3.8, 4.5, 3.6, 4.0];
    var matric = [480, 430, 520, 390, 460];

    chartIdeb.data.labels = anos;
    chartIdeb.data.datasets[0].data = ideb;
    chartIdeb.update();

    chartMat.data.labels = anos;
    chartMat.data.datasets[0].data = matric;
    chartMat.update();
  }

  // 5) Dispara tudo ao mudar qualquer select
  [yearSel,cicloSel,redeSel].forEach(function(s){
    s.addEventListener('change', function(){
      updateComputadores();
      updateRendimento();
      updateIdebMat();
    });
  });

  // 6) Carga inicial
  updateComputadores();
  updateRendimento();
  updateIdebMat();
});
=======
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
>>>>>>> 689330c79b7718dd35c3b8545b4e62a18fae2de1
