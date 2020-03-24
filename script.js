// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'); // document - дом дерево, т.е. это все элементы страницы. Чтобы получить какой-то элемент у документа есть различные элементы (будем использовать query-селектор). Через точку мы обращаемся к селектору, чтобы в дальнейшем получать элементы страницы. Если указать div, то получаем самый первый div, который есть на странице. Через селектор можно получить элемент с айди или классом, необходимо в скобках и кавычках прописать обращение к нужному элементу
const inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');
// База городов
let city = [] // Сделали массив с городами.
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '3d1e8a1d6b0362a9958e1822e2600999',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;
// Функция по получению городов
const getData = (url, callback, reject = console.error) => {
    const request  =  new XMLHttpRequest(); // request - конструктор запроса
    request.open('GET', url); // Позволяет настроить запрос
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status);
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
            return fixCity.startsWith(input.value.toLowerCase());
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
const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);
    return objCity.name;
};
const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};
const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link += data.origin;
    const date = new Date(data.depart_date);
    const day = date.getDate();
    link += day < 10 ? '0' + day : day;
    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';
    
    return link;
    // SVX2905KGD1
}
const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}; 
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    let deep = '';
    if(data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target='_blank' class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению, на текущую дату билетов не нашлось<h3>'
    }
    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};
const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};
const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    cheapTickets.sort((a, b) => {
        if(a.value > b.value) {
            return 1;
        }
        if(a.value < b.value) {
            return -1;
        }
        return 0;
    });
    for(let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
    console.log(cheapTickets);
};
const renderCheap = (data, date) => {
    const cheapTickedYear = JSON.parse(data).best_prices;
    const cheapTickedDay = cheapTickedYear.filter((item) => {
        return item.depart_date === date;
    });
    
    renderCheapDay(cheapTickedDay);
    renderCheapYear(cheapTickedYear);
    
    
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
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };
    if(formData.from && formData.to) {
        const requestData = `?depatr_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token${API_KEY}`;
        // const requestData = '?depatr_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to + '&one_way=true&token' + API_KEY;
        getData(calendar + requestData, (response) => {// response - ответ от сервера
            renderCheap(response, formData.when);
        }, (e) => {
            alert('В этом направлении нет рейса.');
            console.error(e);
        });
    } else {
        alert('Введите корректное название города');
    }
});
// Вызов функции для получении городов
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    city.sort((a, b) => {
        if(a.name > b.name) {
            return 1;
        }
        if(a.name < b.name) {
            return -1;
        }
        return 0;
    });
    console.log(city);
});