const QUANTIDADE_COLUNAS = 5
const QUANTIDADE_LINHAS = 5
const TEXTO_MEIO = '⭐'
let GANHOU = false

// função que cria um elemento html e o retorna 
function criarElemento(tag, conteudo, classes) {
    let elemento = document.createElement(tag)

    elemento.innerHTML = conteudo

    classes.forEach(classe => {
        elemento.classList.add(classe)
    })

    return elemento
}

// função que gera números aleatórios de min (incluso) até max (não incluso)
function gerarNumAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// função que sorteia os números de uma coluna entre os valores menorNum 
// e maiorNum (não incluso). Não permite números repetidos na coluna
function gerarColunaBingo(menorNum, maiorNum) {
    let coluna = Array()

    for (let i = 0; i < QUANTIDADE_LINHAS; i++) {
        let numAleatorio = gerarNumAleatorio(menorNum, maiorNum)

        while (coluna.includes(numAleatorio)) {
            numAleatorio = gerarNumAleatorio(menorNum, maiorNum)
        }

        coluna.push(numAleatorio)
    }

    return coluna
}

// função que gera a matriz de colunas do bingo e o retorna
// o elemento mais ao meio é uma estrela, pois é 'grátis'
function gerarCartelaBingo() {
    let cartelaBingo = [
        gerarColunaBingo(1, 20),
        gerarColunaBingo(20, 40),
        gerarColunaBingo(40, 60),
        gerarColunaBingo(60, 80),
        gerarColunaBingo(80, 100)
    ]

    cartelaBingo[2][2] = TEXTO_MEIO

    return cartelaBingo
}

// função booleana que verifica se uma linha, coluna ou diagonal foi ganhadora no bingo 
function verificarGanhador(arrayBingoHTML) {
    for (let i = 0; i < arrayBingoHTML.length; i++) {
        let colunaGanhadora = arrayBingoHTML[i].every(valor => valor.classList.contains('selecionado'))
        if (colunaGanhadora) {
            alert('Bingo!!')
            GANHOU = true
        }

        let cmpLinhaBingo = (j) => arrayBingoHTML[j][i].classList.contains('selecionado')

        let linhaGanhadora = cmpLinhaBingo(0) && cmpLinhaBingo(1)
            && cmpLinhaBingo(2) && cmpLinhaBingo(3) && cmpLinhaBingo(4)

        if (linhaGanhadora) {
            alert('Bingo!!')
            GANHOU = true
        }
    }

    let cmpBingo = (i, j) => arrayBingoHTML[i][j].classList.contains('selecionado')

    let diagonalPrincial = cmpBingo(0, 0) && cmpBingo(1, 1) && cmpBingo(2, 2)
        && cmpBingo(3, 3) && cmpBingo(4, 4)

    let diagonalSecundaria = cmpBingo(4, 0) && cmpBingo(3, 1) &&
        cmpBingo(2, 2) && cmpBingo(1, 3) && cmpBingo(0, 4)

    if (diagonalPrincial || diagonalSecundaria) {
        alert('Bingo!!')
        GANHOU = true;
    }
}

// função que gera e retorna uma lista a partir de um nodeList HTML
function arrayBingoFromHTML(bingoHTML) {
    let arrayBingoHTML = []

    bingoHTML.childNodes.forEach(coluna => {
        let tmpColuna = Array()

        coluna.childNodes.forEach(num => {
            tmpColuna.push(num)
        })

        arrayBingoHTML.push(tmpColuna)
    })

    return arrayBingoHTML
}

// função para tratar o clique dos números
function selecionaNumero(numero, bingoHTML) {
    let classe = numero.classList
    let apertado = classe.contains('selecionado')

    apertado ? classe.remove('selecionado') : classe.add('selecionado')


    if (!GANHOU) {
        verificarGanhador(arrayBingoFromHTML(bingoHTML))
    }
}

// função que gera a cartela do bingo no HTML e a retorna
function desenhaBingo(cartelaBingo) {
    let bingoDiv = criarElemento('div', '', ['cartela'])
    let header = criarElemento('header', 'BINGO', ['titulo'])

    document.body.appendChild(header)

    cartelaBingo.forEach((coluna) => {
        let colunaDiv = criarElemento('div', '', ['coluna'])
        coluna.forEach(num => {
            let numDiv = criarElemento('div', num, ['numero'])

            numDiv.addEventListener('click', () => selecionaNumero(numDiv, bingoDiv))

            colunaDiv.appendChild(numDiv)

            if (num === '⭐') {
                numDiv.classList.add('selecionado')
            }
        })

        bingoDiv.appendChild(colunaDiv)
    })

    document.body.appendChild(bingoDiv)
}

// espera página carregar para gerar cartela de bingo e desenhá-la na tela
window.addEventListener('load', () => {
    let cartelaBingo = gerarCartelaBingo()
    desenhaBingo(cartelaBingo)
})
