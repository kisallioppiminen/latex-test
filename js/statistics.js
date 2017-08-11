class Statistics {
  /**
   * Appends course related exercise statistics to exercise header
   * @param  {Obj} data JSON data
   */
  static markStats(data) {
    $("div.stats").remove();
    $(".tehtava").each(function (index, value) {
      let stat = data[this.id];
      let template = `<div class="stats" style="float: right; display: inline-block;"><span style="color:#D0011B;margin-right:1.25em;"><b>${stat.red}</b></span><span style="color:#F6A623;margin-right:1.25em;"><b>${stat.yellow}</b></span><span style="color:#417505;margin-right:1em;"><b>${stat.green}</b></span></div>`;
      $(value).find("header h1").append(template);
    });
  }

  /**
   * Gets course related exercise statistics from backend
   * @param  {Integer} id Course ID
   */
  static getStats(id) {
    backend.get(`courses/${id}/exercises/statistics`)
      .then(
        function fulfilled(data) {
          Statistics.markStats(data);
        },
        function rejected(data) {
          console.warn(data);
        }
      );
  }
}
