var mcalendar = {
  props: {
    startyear: { type: Number, required: true }
  },
  template: '' +
    '<div class="mcalendar">' +
      '<div class="mcalendar-nav">Calendar Nav {{ startyear }}</div>' +
      '<div class="mcalendar-table">Calendar Table</div>' +
    '</div>'
};

