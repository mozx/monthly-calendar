var mcalendarnav = {
  props: {
    startyear: { type: Number, required: true }
  },
  template: '' +
    '<div class="mcalendar-nav">' +
      '<div>' +
        '<b-button @click="decrement">Prev</b-button>' +
        '<b-form-select ' +
          'v-model="year" ' +
          ':options="yearoptions" ' +
          '@change="changed">' +
        '</b-form-select>' +
        '<b-form-select ' +
          'v-model="month" ' +
          ':options="monthoptions" ' +
          '@change="changed">' +
        '</b-form-select>' +
        '<b-button @click="increment">Next</b-button>' +
      '</div>' +
    '</div>',
  data () {
    return {
      year: 2020,
      month: 1,
      yearoptions: [],
      monthoptions: [],
    }
  },
  mounted () {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.yearoptions.length = 0;
    for (var y = today.getFullYear(); y >= this.startyear; y -= 1) {
      this.yearoptions.push({ value: y, text: y.toString() });
    }
    this.monthoptions.length = 0;
    for (var m = 1; m <= 12; m += 1) {
      this.monthoptions.push({ value: m, text: m.toString() });
    }
    this.changed();
  },
  methods: {
    increment () {
      this.month += 1;
      if (this.month > 12) {
        this.year += 1;
        this.month -= 12;
      }
      this.changed();
    },
    decrement () {
      if (this.year === this.startyear && this.month === 1) {
        return;
      }
      this.month -= 1;
      if (this.month < 1) {
        this.year -= 1;
        this.month += 12;
      }
      this.changed();
    },
    changed () {
      console.log('monthchanged: ' + this.year + '-' + this.month);
      this.$emit('monthchanged', { year: this.year, month: this.month });
    }
  }
};

var mcalendar = {
  props: {
    startyear: { type: Number, required: true }
  },
  template: '' +
    '<div class="mcalendar">' +
      '<mcalendar-nav ' +
        ':startyear="startyear" ' +
        'class="mcalendar-nav" ' +
        '@monthchanged="monthchanged"' +
      '></mcalendar-nav>' +
      '<div class="mcalendar-table">Calendar Table</div>' +
    '</div>',
  components: {
    'mcalendar-nav': mcalendarnav
  },
  methods: {
    monthchanged ( to ) {
      console.log('month changed to year:' + to.year + ', month:' + to.month);
    }
  }
};

