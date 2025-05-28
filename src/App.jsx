import { useState } from "react"; //Importamos la función de React que se llama useState, que se usa en los componentes funcionales como este, para guardar y actualizar valores dinámicos: input, resultados, etc...
import "./App.css"; //para importar el estilo del archivo css

//Esta es la definición del componente App y la creación de estados con useState
function App() { //define el componente principal (los componentes son funciones que devuelven interfaz de usuario: HTML + lógica)

  const [monto, setMonto] = useState(""); //Aquí se crea una variable de estado que se llama monto. Guarda lo que el usuario escriba en el input. setMonto cambia el valor de monto. "" es el valor inicial (vacío)
  const [monedaOrigen, setMonedaOrigen] = useState("USD"); //guarda la moneda seleccionada de origen
  const [monedaDestino, setMonedaDestino] = useState("EUR"); //guarda la moneda de destino
  const [resultado, setResultado] = useState(null); //guarda el resultado final. null = aún no se ha hecho la conversión

  // En resumen:
  // monto → número que escribe el usuario
  // monedaOrigen → la moneda de origen
  // monedaDestino → la moneda destino
  // resultado → el valor convertido (resultado final)



// manejarSubmit se ejecuta cuando el usuario hace clic en el botón "Convertir"
 const manejarSubmit = async (e) => {
  e.preventDefault(); // evita que se recargue la página al enviarse el formulario. 
  // Esto debemos usarlo en REACT para que no se pierdan los datos que escribe el usuario.
  // para que no se reinicie el componente como si se hubiera abierto de nuevo, para que no se interrumpa el flujo de la app
  // Esto: e.preventDefault(); le dice al navegador que no recargue la página, 
  // así podemos controlar validaciones, llamadas a apis, mostrar resultados en pantalla sin que se pierda nada.
  if (!monto || isNaN(monto)) { // esta línea valida que el valor que el usuario escribió sea un número válido.
    // !monto se asegura de que no esté vacío e isNaN(monto) revisa si no es un número. 
    // Si cualquiera de estas dos condiciones es true, se mostrará la siguiente alerta:
    alert("Por favor ingresa un monto válido");
    return;
  }
  // Dentro del bloque try/catch es donde vamos a conectar con la API real de divisas y se maneja la respuesta
  // Estructura usada en JS para probar algo que podría fallar
  // Si todo sale bien: ejecuta el bloque de TRY
  // Si algo sale mal: ejecuta el bloque CATCH y se muestra un error sin que se rompa la app
  try {
    // Aquí se hace una llamada HTTP a la API nueva con clave
    // fetch(...) es una función para llamar a APIs desde el navegador
    // await le dice a JavaScript: "espera a que termine esta llamada antes de continuar"
    const res = await
 fetch(`https://v6.exchangerate-api.com/v6/eb248bea54c49539555528d5/latest/${monedaOrigen
 }`);
    // Esta siguiente línea convierte la respuesta de la API (que viene en formato JSON) a un objeto de JS
    const data = await res.json();
    console.log("Respuesta de la nueva API:", data); 
    // Comprobamos si la API devuelve una tasa de conversión válida
    if (data.conversion_rates && data.conversion_rates[monedaDestino]) {
      const tasa = data.conversion_rates[monedaDestino];
      const resultadoFinal = monto * tasa;
      setResultado(resultadoFinal.toFixed(2)); // redondeamos a 2 decimales
    } else {
      alert("No se pudo obtener la tasa de conversión.");
      setResultado(null);
    }
  } catch (error) {
    console.error("Error al convertir:", error);
    alert("Hubo un error al conectar con la API.");
  }
  // Esto se imprime en la consola del navegador, es una forma de depurar y ver si todo está funcionando antes de usar la API
  console.log(`Convertir ${monto} de ${monedaOrigen} a ${monedaDestino}`);
 };


  // Este es el RETORNO del componente App, que define todo lo que se muestra visualmente en la app.
  // return en un componente de React indica qué va a renderizarse (mostrarse) en la pantalla.
  // Aquí estamos devolviendo una interfaz JSX para el conversor.
  // JSX = HTML dentro de JS. React lo transforma en código real para mostrarlo en el navegador.
  return (
    <div className="contenedor">
      <h1>💱 Conversor de Divisas</h1>

      <form onSubmit={manejarSubmit}>
        <input
          type="number"
          placeholder="Monto a convertir"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <select value={monedaOrigen} onChange={(e) => setMonedaOrigen(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CLP">CLP</option>
          <option value="MXN">MXN</option>
        </select>

        <select value={monedaDestino} onChange={(e) => setMonedaDestino(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CLP">CLP</option>
          <option value="MXN">MXN</option>
        </select>

        <button type="submit">Convertir</button>
      </form>

      {resultado && (
        <div className="resultado">
          <p>{monto} {monedaOrigen} = <strong>{resultado} {monedaDestino}</strong></p>
        </div>
      )}
    </div>
  );
}

// Con todo este código conseguimos una interfaz completa que:
  // Recibe un monto a convertir
  // Permite elegir monedas
  // Muestra el resultado
  // Controla todo con React

export default App;
