
// Converte número para formato brasileiro
export const formatNumber = (amount, decimalCount = 2, decimal = ",", thousands = ".") => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return (negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""));
  } catch (e) {
    console.log(e);
  }
}

// Converte número para formato monetario brasileiro
export const formatCurrency = (amount) => {
  try {
    return amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  } catch (e) {
    console.log(e);
  }
}

// Converte a data atual para formato DD/MM/YYYY (screen) ou YYYY-MM-DD (database)
export const formatDateCurrent = (format = 'screen') => {
  try {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) { day = '0' + day.toString(); }
    if (month < 10) { month = '0' + month.toString(); }

    return (format == 'database') ? year + '-' + month + '-' + day : day + '/' + month + '/' + year;
  } catch (e) {
    return (format == 'database') ? '0000-00-00' : '00/00/0000';
  }
}

// Converte a data informada para o formato DD/MM/YYYY (screen) ou YYYY-MM-DD (database)
export const formatDate = (date, format = 'screen') => {
  try {
    let day = (date) ? new Date(date).getDate() + 1 : '00';
    let month = (date) ? new Date(date).getMonth() + 1 : '00';
    let year = (date) ? new Date(date).getFullYear() : '0000';

    if (day < 10) { day = '0' + day.toString(); }
    if (month < 10) { month = '0' + month.toString(); }

    return (format == 'database') ? year + '-' + month + '-' + day : day + '/' + month + '/' + year;
  } catch (e) {
    return (format == 'database') ? '0000-00-00' : '00/00/0000';
  }
}

// Converte a hora atual para formato HH:MM
export const formatTimetablesCurrent = (withSeconds = false) => {
  try {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hours < 10) { hours = '0' + hours.toString(); }
    if (minutes < 10) { minutes = '0' + minutes.toString(); }
    if (seconds < 10) { seconds = '0' + seconds.toString(); }

    return (withSeconds) ? hours + ':' + minutes + ':' + seconds : hours + ':' + minutes;
  } catch (e) {
    return '00:00:00';
  }
}

// Converte Texto
export const formatText = (text, format = 'uppercase') => {
  try {
    let newText = '';
    if (text) {
      newText = (format == 'lowercase') ? text.toString().toLowerCase() : text.toString().toUpperCase();
    }

    return newText;
  } catch (e) {
    return text;
  }
}

// Converte CEP
export const formatCEP = (value, format = 'unmask') => {
  try {
    let newValue = value.replace(/[^0-9]+/g, '');
    if (format == 'mask') {
      newValue = newValue.substr(0, 5) + '-' + newValue.substr(5, 3);
    }

    return newValue;
  } catch (e) {
    return value;
  }
}

// Converte texto retirando espaços em branco e formatações
export const removeMask = (value) => {
  try {
    let newValue = value.replace(/\s/g, "");
    newValue = newValue.replace("." , "");
    newValue = newValue.replace("/" , "");
    newValue = newValue.replace("-" , "");

    return newValue;
  } catch (e) {
    return value;
  }
}

// Converte um texto com acentos e espaços para o padrão de URI
export const formatTextForUri = (value) => {
  try {
    let newValue = encodeURIComponent(value);

    return newValue;
  } catch (e) {
    return value;
  }
}

// Nome de um Status, de acordo com o tipo de entidade e a abreviação (código)
export const statusCodeForName = (entity, code) => {
  let codename = code;
  try {
    if (entity) {
      switch(entity) {
        case 'ENTREGA':
          switch(code) {
            case 'NI': codename = 'Não iniciada'; break;
            case 'EDR': codename = 'Entregador em deslocamento para local de retirada'; break;
            case 'I': codename = 'Iniciada'; break;
            case 'CA': codename = 'Cancelada'; break;
            case 'CO': codename = 'Concluída'; break;
            case 'ENE': codename = 'Entregador não encontrado'; break;
          }
          break;

        case 'VEICULO':
          switch(code) {
            case 'B': codename = 'Bicicleta'; break;
            case 'M': codename = 'Moto'; break;
            case 'C': codename = 'Carro'; break;
            case 'CM': codename = 'Caminhão'; break;
          }
          break;

        case 'ICONE_VEICULO':
          switch(code) {
            case 'B': codename = 'bike'; break;
            case 'M': codename = 'motorbike'; break;
            case 'C': codename = 'car'; break;
            case 'CM': codename = 'van'; break;
          }
          break;

        case 'TIPO_PAGAMENTO':
          switch(code) {
            case 'D': codename = 'Dinheiro'; break;
            case 'CC': codename = 'Cartão de Crédito'; break;
            case 'CD': codename = 'Cartão de Débito'; break;
          }
          break;

        case 'OPERACAO_FINANCEIRA':
          switch(code) {
            case 'D': codename = 'Débito'; break;
            case 'C': codename = 'Crédito'; break;
          }
          break;

        case 'TIPO_CONTA':
          switch(code) {
            case 'C': codename = 'Corrente'; break;
            case 'P': codename = 'Poupança'; break;
          }
          break;
      }
    }
  } catch (error) {
    codename = 'Erro na identificação';
  }

  return codename;
}