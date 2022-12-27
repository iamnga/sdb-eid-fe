export default class Utils {
  static issPlace = 'CTCCSQLHCVTTXH';

  static randomId(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //dd/MM/yyyy => yyyyMMdd
  static formatDate(date: string) {
    let arr = date.split('/');
    return arr[2] + arr[1] + arr[0];
  }

  //yyyyMMdd => dd/MM/yyyy
  static strToDate(date: string) {
    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);
    return [day, month, year].join('/');
  }
}
