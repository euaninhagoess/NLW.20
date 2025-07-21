const apikeyinput = document.getElementById('apikey')
const gameselect = document.getElementById('gameselect')
const questioninput = document.getElementById('questioninput')
const askbutton = document.getElementById('askbutton')
const airesponse = document.getElementById('airesponse')
const form = document.getElementById('form') 
// VARIAVEIS


const markdownToHTML = (text) => { //função
    const converter = new showdown.Converter() //<- objeto
    return converter.makeHtml(text)

}
const perguntarAI = async (question, game, apikey) => { 
    //criar função
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}` //correção
    //BLOCOS
    const pergunta = `
      ## Especialidade 
      Você é um especialista assistente de meta para o jogo ${game}

      ## Tarefa
      Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas.

      ## Regras
      - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
      - Se a pergunta não esta relacionada com o jogo, responda com 'Essa pergunta não está relacionada ao jogo'
      - Considere a data atual ${new Date().toLocaleDateString()}
      - Faça  pesquisas atualizadas sobre o pach atual, baseadon na data atual, para dar uma resposta coerente.
      - Nunca responda itens que você não tenha certeza de que existe no pach atual

      ## Resposta
      - Economize na reposta, seja direto e responda no máximo 500 caracteres.
      - Responda em markdown
      - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuario está querendo.

      ## Exemplo de resposta
      Pergunta do ususario: Melhor build rengar jungle
      Resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\n exemplo de runas\n\n

      ---
      Aqui está a pergunta do usuário ${question}
      `
     //engenharia de pronpt = fazer a melhor pergunta para IA com etapas


     const contents = [{
        role: "user",
        parts:[{
            text: pergunta
        }]
     }] 

     const tools = [{ 
        google_search: {} //ferramenta
     }]

      //chamada API 
  const response = await fetch (geminiURL, {
    method: 'POST', 
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        contents,
        tools
    })
  })
  

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}


const enviarformulario = async (event) =>{
    event.preventDefault()
    const apikey = apikeyinput.value 
    const game = gameselect.value
    const question = questioninput.value


    if(apikey == '' || game == '' || question == '' ) {
        alert('Por favor, preencha todos os campos')
        return       
    }

    askbutton.disabled = true
    askbutton.textContent = 'Perguntando...'
    askbutton.classList.add ('loading')

    try { //dentrro do enviarformulario
    const text = await perguntarAI (question, game, apikey) //executar IA
    airesponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    airesponse.classList.remove('hidden')
}  catch(error) {
    console.log('Error: ',error)
}  finally {
    askbutton.disabled = false
    askbutton.textContent = "Perguntar"
    askbutton.classList.remove('loading')
}

} 

form.addEventListener ('submit', enviarformulario)


