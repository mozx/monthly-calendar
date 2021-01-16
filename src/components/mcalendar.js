var mcalendarnav = {
  props: {
    startyear: { type: Number, required: true }
  },
  template: '' +
    '<div class="mcalendar-nav">' +
      // CalendarNav main part
      '<div>' +
        '<b-button @click="decrement">Prev</b-button>' +
        '<b-form-select ' +
          'v-model="year" ' +
          ':options="yearoptions" ' +
          '@change="changed"' +
        '>' +
        '</b-form-select>' +
        '<b-form-select ' +
          'v-model="month" ' +
          ':options="monthoptions" ' +
          '@change="changed"' +
        '>' +
        '</b-form-select>' +
        '<b-button @click="increment">Next</b-button>' +
      '</div>' +
      // Auxiliary nav control for debugging
      // Selection Start Day Of Week
      '<div>' +
        '<b-form-group label="Start Day Of Week">' +
          '<b-form-radio-group ' +
            'v-model="dow" ' +
            ':options="dowoptions" ' +
            'buttons ' +
            'button-variant="outline-primary" ' +
            '@change="dowchanged"' +
          '/>' +
        '</b-form-group>' +
      '</div>' +
      // Toggle Show Out Of Month
      '<div>' +
        '<b-form-checkbox ' +
          'v-model="showoutofmonth" ' +
          'switch ' +
          '@change="showoutofmonthchanged"' +
        '>' +
          'Show dates of previous/next month' +
        '</b-form-checkbox>' +
      '</div>' +
      // Selection Day Of Week header language
      '<div>' +
        '<b-form-group label="Day Of Week Header">' +
          '<b-form-radio-group ' +
            'v-model="dowlang" ' +
            ':options="dowlangoptions" ' +
            'buttons ' +
            'button-variant="outline-primary" ' +
            '@change="dowlangchanged"' +
          '/>' +
        '</b-form-group>' +
      '</div>' +
    '</div>',
  data () {
    return {
      year: 2020,
      month: 1,
      yearoptions: [],
      monthoptions: [],
      dow: 0,
      showoutofmonth: true,
      dowoptions: [
        { text: 'Sun', value: 0 },
        { text: 'Mon', value: 1 },
        { text: 'Tue', value: 2 },
        { text: 'Wed', value: 3 },
        { text: 'Thu', value: 4 },
        { text: 'Fri', value: 5 },
        { text: 'Sat', value: 6 }
      ],
      dowlang: 'en',
      dowlangoptions: [
        { text: 'None', value: '' },
        { text: 'English', value: 'en' },
        { text: 'Japanese', value: 'ja' }
      ]
    }
  },
  mounted () {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.yearoptions.length = 0;
    for (var y = today.getFullYear() + 1; y >= this.startyear; y -= 1) {
      this.yearoptions.push({ value: y, text: y.toString() });
    }
    this.monthoptions.length = 0;
    for (var m = 1; m <= 12; m += 1) {
      this.monthoptions.push({ value: m, text: m.toString() });
    }
    this.changed();
    this.dowchanged();
    this.showoutofmonthchanged();
    this.dowlangchanged();
  },
  methods: {
    increment () {
      var nextyear = new Date().getFullYear() + 1;
      if (this.year === nextyear && this.month === 12) {
        return;
      }
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
    },
    dowchanged () {
      console.log('dowchanged: ' + this.dow);
      this.$emit('dowchanged', this.dow);
    },
    showoutofmonthchanged () {
      var val = this.showoutofmonth;
      this.$emit('showoutofmonthchanged', val);
    },
    dowlangchanged () {
      this.$emit('dowlangchanged', this.dowlang);
    }
  }
};

var mcalendartablecell = {
  props: {
    index: { type: Number, required: true },
    offset: { type: Number, required: true },
    lastdate: { type: Number, required: true },
    lastdateofprevmonth: { type: Number, required: true },
    dow: { type: Object, default: function () { return { key: 0, val: 0 } } },
    showoutofmonth: { type: Boolean, default: true },
    holidays: { type: Object, default: () => ({}) }
  },
  template: '' +
    '<div ' +
      'v-if="isvisiblerow" ' +
      'class="mcalendar-table-cell" ' +
      ':class="[{ outofmonth: isoutofmonth }, { lastrow: islastrow }]"' +
    '>' +
      '<div v-if="! isoutofmonth || showoutofmonth">' +
        '<div>' +
          '<span class="date" :class="datecolorclass">{{ displaydate }}</span>' +
          '<span class="holiday">{{ (holidays[index + offset] || \'\') }}</span>' +
        '</div>' +
      '</div>' +
    '</div>',
  computed: {
    isvisiblerow () {
      return ((( Math.floor(this.index / 7) * 7) + this.offset) <= this.lastdate)
    },
    islastrow () {
      var indexoflastdate = this.lastdate - this.offset;
      return (Math.floor(this.index / 7) === Math.floor(indexoflastdate / 7));
    },
    isoutofmonth () {
      return ((this.index + this.offset) <= 0 || this.lastdate < (this.index + this.offset));
    },
    datecolorclass () {
      return 'dow' + (this.holidays[this.index + this.offset] ? '0' : this.dow.val);
    },
    displaydate () {
      var dispdate = this.index + this.offset;
      if (dispdate <= 0) {
        dispdate += this.lastdateofprevmonth;
      } else if (this.lastdate < dispdate) {
        dispdate -= this.lastdate;
      }
      return dispdate;
    }
  }
}

var mcalendartable = {
  props: {
    dowheader: { type: Array, required: true },
    offset: { type: Number, required: true },
    firstdayofweek: { type: Number, required: true },
    lastdate: { type: Number, required: true },
    lastdateofprevmonth: { type: Number, required: true },
    showoutofmonth: { type: Boolean, default: true },
    holidays: { type: Object, default: () => ({}) },
    dowlang: { type: String, default: '' }
  },
  template: '' +
    '<div>' +
      '<div v-if="dowlang !== \'\'">' +
        '<div ' +
          'v-for="h in dowheader" ' +
          ':key="100 + h.key" ' +
          'class="dowheader" ' +
          ':class="\'dow\' + h.val"' +
        '>' +
          '{{ dowheaderlabel[dowlang][h.val] }}' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<mcalendar-table-cell ' +
          'v-for="i in Array.from(Array(7 * 6), function (v, k) { return k })" ' +
          ':key="i" ' +
          ':index="i" ' +
          ':offset="offset" ' +
          ':lastdate="lastdate" ' +
          ':lastdateofprevmonth="lastdateofprevmonth" ' +
          ':dow="dowheader[i % 7]" ' +
          ':showoutofmonth="showoutofmonth" ' +
          ':holidays="holidays"' +
        '></mcalendar-table-cell>' +
      '</div>' +
    '</div>',
  components: {
    'mcalendar-table-cell': mcalendartablecell,
  },
  data: function () {
    return {
      dowheaderlabel: {
        '': [ '', '', '', '', '', '', '' ],
        'en': [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        'ja': [ '日', '月', '火', '水', '木', '金', '土' ]
      }
    }
  }
}

var mcalendar = {
  props: {
    startyear: { type: Number, required: true }
  },
  template: '' +
    '<div class="mcalendar">' +
      '<mcalendar-nav ' +
        ':startyear="startyear" ' +
        '@monthchanged="monthchanged" ' +
        '@dowchanged="dowchanged" ' +
        '@showoutofmonthchanged="showoutofmonthchanged" ' +
        '@dowlangchanged="dowlangchanged"' +
      '></mcalendar-nav>' +
      '<mcalendar-table ' +
        ':dowheader="dowheader" ' +
        ':offset="offset" ' +
        ':firstdayofweek="firstdayofweek" ' +
        ':lastdate="lastdate" ' +
        ':lastdateofprevmonth="lastdateofprevmonth" ' +
        ':showoutofmonth="showoutofmonth" ' +
        ':holidays="holidays" ' +
        ':dowlang="dowlang"' +
      '></mcalendar-table>' +
    '</div>',
  components: {
    'mcalendar-nav': mcalendarnav,
    'mcalendar-table': mcalendartable
  },
  data: function () {
    return {
      year: this.startyear,
      month: 1,
      dowheader: [],
      offset: 0,
      firstdayofweek: 0,
      lastdate: 30,
      lastdateofprevmonth: 30,
      begindow: 0,
      showoutofmonth: true,
      allholidays: {},
      holidays: {},
      dowlang: ''
    }
  },
  mounted () {
    // It may require to disable web security
    var self = this
    axios
      .get('holidays/holidays.json')
      .then ( function (response) {
        console.log('response.data: ' + JSON.stringify(response.data));
        self.allholidays = response.data
        self.holidays = self.allholidays[self.year.toString()][self.month.toString()];
        console.log('self.holidays: ' + JSON.stringify(self.holidays));
      })
      .catch ( function (error) {
        console.log(error);
      })
      .finally ( function () {
        console.log('finally');
        console.log('self.allholidays: ' + JSON.stringify(self.allholidays));
      })
  },
  methods: {
    monthchanged ( to ) {
      this.updatemonthparams( this, to )
    },
    updatemonthparams ( self, to ) {
      console.log('month changed to year:' + to.year + ', month:' + to.month);
      self.year = to.year
      self.month = to.month
      // month param for Date constructor takes (month - 1). Last date of the month is 0th day of next month
      self.lastdateofprevmonth = new Date(to.year, to.month - 1, 0).getDate();
      self.lastdate = new Date(to.year, to.month, 0).getDate();
      self.firstdayofweek = new Date(to.year, to.month - 1, 1).getDay();
      self.offset = ((self.begindow > self.firstdayofweek) ? -7 : 0) + (self.begindow - self.firstdayofweek) + 1;
      self.holidays = (Object.keys(self.allholidays).length > 0) ? self.allholidays[self.year][self.month] : {};
      console.log('self.holidays: ' + JSON.stringify(self.holidays));
    },
    dowchanged ( dow ) {
      var dowindices = [0, 1, 2, 3, 4, 5, 6];
      var dowheader = dowindices.slice(dow, 7).concat(dowindices.slice(0, dow));
      this.dowheader.length = 0;
      for (var i = 0; i < 7; i += 1) {
        this.dowheader.push({ key: i, val: dowheader[i] })
      }
      this.begindow = dow;
      this.offset = ((this.begindow > this.firstdayofweek) ? -7 : 0) + (this.begindow - this.firstdayofweek) + 1;
      console.log('this.offset: ' + this.offset);
      console.log('dowheader' + JSON.stringify(this.dowheader));
    },
    showoutofmonthchanged (val) {
      this.showoutofmonth = val;
    },
    dowlangchanged ( dowlang ) {
      console.log('dowlangchanged: ' + dowlang);
      this.dowlang = dowlang
    }
  }
};

