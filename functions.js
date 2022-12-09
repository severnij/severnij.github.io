function log (str)
{
    console.log(str);
}

// Возвращает случайных индекс массива.
function getRandomArrayIndex(arrayLength)
{
    return Math.floor(Math.random() * (arrayLength - 1));
}

// Возвращает массив, упорядоченный в случайном порядке.
function getRandomArrayOrder(array)
{
    let arrayCount = [];

    for (let i = 0; i < array.length; i++)
        arrayCount[i] = i;

    let arrayRandomOrder = [];

    for (let i = 0; i < arrayCount.length + i; i++)
    {
        const itemIndex =  getRandomArrayIndex(arrayCount.length);
        const itemNumber = arrayCount[itemIndex];
        arrayCount.splice(itemIndex, 1);
        arrayRandomOrder[i] = array[itemNumber];
    }

    return arrayRandomOrder;
}

// Возвращает HTML-табличку, заполненную значениями из массива.
function getTableFilledByArray(tableRowsNumber, tableColumnsNumber, array)
{
    let tableCellsNumber = tableRowsNumber * tableColumnsNumber;

    const table = document.createElement("table");

    for (let i = 0; i < tableRowsNumber; i++)
    {
        const tr = document.createElement("tr");
        table.append(tr);

        for (let j = 0; j < tableColumnsNumber; j++)
        {
            const td = document.createElement("td");
            td.innerText = array[--tableCellsNumber];
            tr.append(td);
        }
    }

    return table;
}

// Завершаем Игру.
function gameOver()
{
    if (confirm("Game Over!"))
    {
        setupGame();  
    }
}

// Скрываем найденную пару Волшебных Символов.
function hideMagicSymbolsPair(magicSymbolsPairsNumber)
{
    // Счётчик найденных пар Волшебных Символов.
    let magicSymbolsPairsCount = 0;

    // Создаём замыкание, чтобы считать количество найденных пар
    // Волшебных Символов прямо здесь, а не передавать каждый раз
    // в качестве аргумента при вызове этой функции.
    return function(firstMagicSymbol, secondMagicSymbol)
    {
        magicSymbolsPairsCount++

        firstMagicSymbol.innerText = null;
        secondMagicSymbol.innerText = null;
        
        if (magicSymbolsPairsCount === magicSymbolsPairsNumber)
            // Вызываем функцию с задержкой, иначе браузерное сообщение
            // блокирует сокрытие пары Волшебных Символов.
            setTimeout(gameOver, 10);
    }
}

// Добавляем обработчик Кликов к ячейкам таблички.
function addClickListenerOnTableCells(tableSelector)
{
    const tableCells = document.querySelectorAll(`.${tableSelector} > table > tr > td`);

    // Инициализация переменной, хранящей предидущий выбранный Волшебный Знак.
    let prevMagicSymbol = null;

    // Инициализация переменной, хранящей уникальный номер предидущего выбранного Волшебного Знака.
    let prevMagicSymbolNumber = null;

    // При инициализации замыкания происходит инициализация её внутренних
    // переменных.
    const hideMagicSymbolsPairClosure = hideMagicSymbolsPair(tableCells.length / 2);
    
    tableCells.forEach(
        function(item, i) {
            item.addEventListener("click", () => {
                log(`${item.innerText}, ${prevMagicSymbol}, ${prevMagicSymbolNumber}, ${i}`);

                // Если Волшебный Знак выбран первым в паре Волшебных Знаков.
                if (prevMagicSymbol === null)
                {
                    prevMagicSymbol = item.innerText;
                    prevMagicSymbolNumber = i;
                    
                    // "Подсвечиваем" выбранную ячейку. 
                    item.style.backgroundColor = "lightGray";
                }
                else if (prevMagicSymbol === item.innerText && prevMagicSymbolNumber != i && item.innerText != "")
                // Если выбранный Волшебный Знак выбран вторым в паре Волшебных Знаков
                // и эквивалентен по Смыслу первому выбранному в паре Волшебному Знаку,
                // но не тождественен ему.
                // И не происходит выбор пустого Места.
                {
                    prevMagicSymbol = null;

                    // Отменяем "подсвечивание" предидущей выбранной ячейки.
                    tableCells[prevMagicSymbolNumber].style.backgroundColor = "white";
                    
                    hideMagicSymbolsPairClosure(item, tableCells[prevMagicSymbolNumber]);
                }
                else
                // Если выбранный Волшебный Знак выбран вторым в паре Волшебных Знаков,
                // но не эквивалентен по Смыслу первому выбранному в паре Волшебному Знаку
                // либо тождественен Самому Себе.
                {
                    prevMagicSymbol = null;

                    // Отменяем "подсвечивание" предидущей выбранной ячейки.
                    tableCells[prevMagicSymbolNumber].style.backgroundColor = "white";
                }
            });
        }
    );
}

// Инициализация Игры.
function setupGame()
{
    // Выбираем Волшебные Символы в набор.
    const magicSymbols = [
        "❤️", "❤️",
        "💔", "💔",
        "☀︎", "☀︎",
        "💩", "💩",
        "🙈", "🙈",
        "👍🏻", "👍🏻",
        "🍎", "🍎",
        "😍", "😍",
    ];
    
    // Получаем набор Волшебных Символов отсортированных в случайном порядке.
    const magicSymbolsRandomOrder = getRandomArrayOrder(magicSymbols);

    // Определяем Место для Волшебных Символов.
    const tablePlace = document.querySelector(".tablePlace");

    // Узнаём, есть ли что-то внутри Места для Волшебных Символов.
    const tablePlaceInner = tablePlace.querySelector("*");
    if (tablePlaceInner != null)
        // Если есть - удаляем. 
        tablePlaceInner.remove();
    
    // Расставляем набор Волшебных Символов, распределённых в случайном порядке
    // на их Месте. 
    tablePlace.append(getTableFilledByArray(4, 4, magicSymbolsRandomOrder));
    
    // Добавляем к индивидуальным Местам каждого Волшебного Символа
    // обработчик клика.
    addClickListenerOnTableCells(tablePlace.className);
}