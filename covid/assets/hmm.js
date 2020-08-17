$(document).ready(function () {

  function formatRupiah(num){
    var	number_string = num.toString(),
    sisa 	= number_string.length % 3,
    rupiah 	= number_string.substr(0, sisa),
    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
      
    if (ribuan) {
      separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return rupiah
  }


  function ajax_get(index) {
    $.ajax({
      type: "get",
      url: "https://data.covid19.go.id/public/api/update.json",
      dataType: "json",
      success: function (data) {
        var all_data = [];
        // feather.replace()

        var now = new Date();
        var date = now.getDate() - 1;
        var months = [" January", " February", " March", " April", " May", " June", " July", " August", " September", " October", " November", " December"];
        var labels = [];

        for (let i = 7; i >= 0; i--) {
          labels.push((date - i) + months[now.getMonth()]);
        }

        var length_data = data['update']['harian'].length;
        var keys = ['jumlah_positif', 'jumlah_sembuh', 'jumlah_meninggal', 'jumlah_positif_kum'];

        for (let i = 8; i > 0; i--) {
          all_data.push(data['update']['harian'][length_data - i - 1][keys[index]]['value']);
        }

        $("#total_case").html(formatRupiah(data['update']['total']['jumlah_positif']));
        $("#activated").html(formatRupiah(data['update']['total']['jumlah_dirawat']));
        $("#recovered").html(formatRupiah(data['update']['total']['jumlah_sembuh']));
        $("#deaths").html(formatRupiah(data['update']['total']['jumlah_meninggal']));


        // Graphs
        var ctx = document.getElementById('myChart')

        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                data: all_data,
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
              }
            ]
          },
          options: {
            scales: {},
            legend: {
              display: false
            }
          }
        })
      }
    });
  }

  ajax_get(0);

  $("button").click(function(){
    ajax_get(parseInt($(this).val()));
  });

});