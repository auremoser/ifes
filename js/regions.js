(function() {
  'use strict'

  var csv = dsv(',');
  var colors = '#1f77b4 #aec7e8 #2ca02c #98df8a #d62728 #DD514C #9467bd #c5b0d5 #e377c2 #dbdb8d #17becf #9edae5 #f90'.split(' ');
  var atolls = [];
  var islands = [];

  $.ajax({
      url: 'data/data-regions.csv',
      success: parseCSV
  });


  function parseCSV(raw) {
      var data = csv.parse(raw);
      // console.log(data)

      var c = 0;
      var tmpAtolls = {};
      data.forEach(function(d) {
          if (!(d.atoll && d.island)) { return }
          var atoll = tmpAtolls[d.atoll] || { y: 0, islands: {}, name: d.atoll, color: colors[c++] };
          atoll.y++;
      // add opacity effect to outer (sub)regions to distinguish from atolls
          var island = atoll.islands[d.island] = atoll.islands[d.island] || { y: 0, name: d.island, color: atoll.color };
          island.y++;
          tmpAtolls[d.atoll] = atoll;
      });

      // console.log(tmpAtolls);

      for (var tmp in tmpAtolls) {
          atolls.push(tmpAtolls[tmp]);
      }
      atolls.sort(function(a,b) { return b.y - a.y });

      atolls.forEach(function(d) {
          var tmp = [];
          for (var islandName in d.islands) {
            var island = d.islands[islandName]
              island.color = Highcharts.Color(island.color).brighten(0.1).get('rgb')
              tmp.push(island);
          }
          tmp.sort(function(a,b) { return b.y - a.y });
          islands = islands.concat(tmp);
      });

      // console.log(atolls);
      // console.log(islands);
      render();
  }

  function render() {
      Highcharts.setOptions({
        lang: {
            contextButtonTitle: _('Graph context menu'),
            decimalPoint: _('.'),
            downloadJPEG: _('Download JPG'),
            downloadPDF: _('Download PDF'),
            downloadPNG: _('Download PNG'),
            downloadSVG: _('Download SVG'),
            printChart: _('Print'),
            rangeSelectorFrom: _('From'),
            rangeSelectorTo: _('To'),
            rangeSelectorZoom: ('Zoom'),
            resetZoom: _('Reset zoom'),
            resetZoomTitle: _('Reset zoom level 1:1'),
            thousandsSep: _(',')
        }
      });
      $('#regions').highcharts({
          chart: {
              type: 'pie'
          },
          credits: {
            enabled: false
          },
          title: {
              text: _('Ushahidi Incidents by Region (Atoll + Island)')
          },
          yAxis: {
              title: {
                  text: _('Number of Incidents')
              }
          },

          plotOptions: {
              pie: {
                  shadow: false,
                  center: ['50%', '50%']
              }, 
              series: {
                point: {
                  events: {
                    legendItemClick: function() {
                      var id = this.id,
                      data = this.series.chart.series[0].data;
                      $.each(data, function (i, point) {
                        if (point.atolls == id) {
                          if (point.visible)
                              point.setVisisble(false);
                          else
                              point.setVisible(true);
                        }
                      });
                    }
                  }
                }
              }
          },
          legend: {
              layout: 'vertical',
              floating: true,
              align: 'right',
              verticalAlign: 'top',
              symbolPadding: 20, 
              symbolWidth: 10
          },
          tooltip: {
           valueSuffix: _(' incident(s)')
          },
          series: [{
              name: _('Atolls'),
              data: atolls,
              size: '60%',
              dataLabels: {
                  enabled: false,
                  formatter: function() {
                      return this.point.name;
                  },
                  color: 'white',
                  distance: -30
              }
          }, {
              name: _('Islands'),
              data: islands,
              size: '80%',
              innerSize: '60%',
              dataLabels: {
                  formatter: function() {
                      // display only if larger than 1
                      return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + ' incidents' : null;
                  }
              }
          }]
      });
  }
})();