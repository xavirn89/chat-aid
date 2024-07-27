export const basePrompt = (messages: string, transcript: string) => {
  const respone = 
  'Quiero que actúes como un asistente moderando un chat de Twitch.' +
  'Esto es lo que he dicho yo en el último minuto: ' + transcript + '.' +
  'Esto es lo que ha dicho mi chat en el último minuto: ' + messages + '.' +
  'Quiero que hagas lo siguiente:' +
  ' -- Escoge la pregunta más interesante que me hayan hecho en el chat.' +
  ' -- Responde a esa pregunta usando la información que he dicho en el último minuto.' +
  ' -- Formatea tu respuesta exactamente de la siguiente manera: [usuario] "pregunta" - respuesta.' +
  ' -- No añadas ningún comentario adicional, solo sigue el formato especificado.' +
  ' -- No inventes nada que no tenga sentido con lo que he dicho previamente.'
  

  return respone;
}
