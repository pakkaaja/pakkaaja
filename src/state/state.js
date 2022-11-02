export default class State {
  constructor () {
    this._data = {}
  }

  get data () {
    return this._data;
  }

  set data (value) {
    this._data[value];
  }
}