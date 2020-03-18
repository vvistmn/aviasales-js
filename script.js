const formSearch = document.querySelector('.form-search'); // document - дом дерево, т.е. это все элементы страницы. Чтобы получить какой-то элемент у документа есть различные элементы (будем использовать query-селектор). Через точку мы обращаемся к селектору, чтобы в дальнейшем получать элементы страницы. Если указать div, то получаем самый первый div, который есть на странице. Через селектор можно получить элемент с айди или классом, необходимо в скобках и кавычках прописать обращение к нужному элементу
const inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкент', 'Нижний-Новгород', 'Калининград', 'Вроцлав', 'Воронеж', 'Саратов', 'Липецк', 'Тюмень', 'Ростов-на-Дону',] // Сделали массив с городами.

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixCity = item.toLowerCase();
            return fixCity.includes(input.value.toLowerCase());
        });
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
    }   
};//С помощью селектора filter(forEach - сперва делали через него, разница в том, что фильтр создает новый массив), который мы присвоили переменной filterCity, мы будем перебирать массив city (где указаны города) и сохранять в переменную. В item - будет вноситься значение массива. С помощью return мы будем отображаться значение массива в переменную filterCity, а с помощью метода includes будем работать со строкой, берем значение, которое вписываем в inputCitiesFrom(.value - это значение, которое вводим в инпут).  С помощью forEach, мы элемент, который получили через метод filter будет выводить в ul. С помощью свойства classList.add добавляем ли новый класс. и с помощью свойства textContent добавляем в ли контент( = город, который мы выводили с помощью фильтра). Через dropdownCitiesFrom.append мы добавляем в html контент с тегом ли. В самое начало вставили dropdownCitiesFrom.textContent = ''; для обнуления результатов. Добавили условия, и весь код внесли в условие. Если первый инпут не пустой, то выполняем код, если пустой, то ничего не делаем (2/2)
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
}); // Обратились к элементу, через дом-структуру и указали с помощью селектора addEventListener, чтобы он следил за событиями. В данном случае следим за событием инпут(когда начинают печатать), после этого запускается стрелочную функцию. (1/2)
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});
const clickCity = (input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};
dropdownCitiesFrom.addEventListener('click', () => {
    clickCity(inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener('click', () => {
    clickCity(inputCitiesTo, dropdownCitiesTo);
});