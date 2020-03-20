// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'); // document - дом дерево, т.е. это все элементы страницы. Чтобы получить какой-то элемент у документа есть различные элементы (будем использовать query-селектор). Через точку мы обращаемся к селектору, чтобы в дальнейшем получать элементы страницы. Если указать div, то получаем самый первый div, который есть на странице. Через селектор можно получить элемент с айди или классом, необходимо в скобках и кавычках прописать обращение к нужному элементу
const inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');
// База городов
let city = [] // Сделали массив с городами.
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '3d1e8a1d6b0362a9958e1822e2600999',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';
// Функция по получению городов
const getData = (url, callback) => {
    const request  =  new XMLHttpRequest(); // request - конструктор запроса
    request.open('GET', url); // Позволяет настроить запрос
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    }); // Следим за изменением статуса
    request.send(); // Позваляет данные отправить
};
//Функция по обработке городов и созданию списков в инпутах
const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixCity = item.name.toLowerCase();
            return fixCity.includes(input.value.toLowerCase());
        });
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }   
};//С помощью селектора filter(forEach - сперва делали через него, разница в том, что фильтр создает новый массив), который мы присвоили переменной filterCity, мы будем перебирать массив city (где указаны города) и сохранять в переменную. В item - будет вноситься значение массива. С помощью return мы будем отображаться значение массива в переменную filterCity, а с помощью метода includes будем работать со строкой, берем значение, которое вписываем в inputCitiesFrom(.value - это значение, которое вводим в инпут).  С помощью forEach, мы элемент, который получили через метод filter будет выводить в ul. С помощью свойства classList.add добавляем ли новый класс. и с помощью свойства textContent добавляем в ли контент( = город, который мы выводили с помощью фильтра). Через dropdownCitiesFrom.append мы добавляем в html контент с тегом ли. В самое начало вставили dropdownCitiesFrom.textContent = ''; для обнуления результатов. Добавили условия, и весь код внесли в условие. Если первый инпут не пустой, то выполняем код, если пустой, то ничего не делаем 1.(2/2)
// Функция по списку городов, которая позваляет выбрать с помощью клика
const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};
const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};
const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};
const renderCheap = (data, date) => {
    const cheapTickedYear = JSON.parse(data).best_prices;
    console.log(cheapTickedYear);
    const cheapTickedDay = cheapTickedYear.filter((item) => {
        return item.depart_date === date;
    });
    renderCheapDay(cheapTickedDay);
    renderCheapYear(cheapTickedYear);
    console.log(cheapTickedDay);
    
    
};
// Выводим функцию списка городов
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
}); // Обратились к элементу, через дом-структуру и указали с помощью селектора addEventListener, чтобы он следил за событиями. В данном случае следим за событием инпут(когда начинают печатать), после этого запускается стрелочную функцию. 1.(1/2)
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});
// Выводим функцию выбора городов из списка с помощью клика
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name),
        cityTo = city.find((item) => inputCitiesTo.value === item.name);
    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    }
    const requestData = `?depatr_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token${API_KEY}`;
    // const requestData = '?depatr_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to + '&one_way=true&token' + API_KEY;
    getData(calendar + requestData, (response) => {// response - ответ от сервера
        renderCheap(response, formData.when);
    });
});
// Вызов функции для получении городов
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
    console.log(city);
});