function CalculatorDisplay({ display }) {
 return <div className="calculator__display">{display}</div>;
}

function CalculatorKey({ operator, action, text, clickHandler }) {
 return (
  <button
   className={operator ? "key--operator" : ""}
   data-action={action ? action : ""}
   onClick={clickHandler}
  >
   {text}
  </button>
 );
}

function CalculatorKeys({ clickHandler }) {
 return (
      <div className="calculator__keys">
      <CalculatorKey
        operator={true}
        keyId="add"
        action="add"
        text="+"
        clickHandler={clickHandler}
      />
      <CalculatorKey
        operator={true}
        keyId="subtract"
        action="subtract"
        text="-"
        clickHandler={clickHandler}
      />
      <CalculatorKey
        operator={true}
        keyId="multiply"
        action="multiply"
        text="&times;"
        clickHandler={clickHandler}
      />
      <CalculatorKey
        operator={true}
        keyId="divide"
        action="divide"
        text="%"
        clickHandler={clickHandler}
      />
      <CalculatorKey keyId="seven" text="7" clickHandler={clickHandler} />
      <CalculatorKey keyId="eight" text="8" clickHandler={clickHandler} />
      <CalculatorKey keyId="nine" text="9" clickHandler={clickHandler} />
      <CalculatorKey keyId="four" text="4" clickHandler={clickHandler} />
      <CalculatorKey keyId="five" text="5" clickHandler={clickHandler} />
      <CalculatorKey keyId="six" text="6" clickHandler={clickHandler} />
      <CalculatorKey keyId="one" text="1" clickHandler={clickHandler} />
      <CalculatorKey keyId="two" text="2" clickHandler={clickHandler} />
      <CalculatorKey keyId="three" text="3" clickHandler={clickHandler} />
      <CalculatorKey keyId="zero" text="0" clickHandler={clickHandler} />
      <CalculatorKey
        action="decimal"
        keyId="decimal"
        text="."
        clickHandler={clickHandler}
      />
      <CalculatorKey
        action="clear"
        keyId="clear"
        text="AC"
        clickHandler={clickHandler}
      />
      <CalculatorKey
        action="calculate"
        keyId="equals"
        text="="
        clickHandler={clickHandler}
      />
    </div>
 );
}

class Calculator extends React.Component {
 constructor(props) {
  super(props);
 }

 render() {
  return (
   <div className="calculator">
    <CalculatorDisplay display={this.props.display} />
    <CalculatorKeys clickHandler={this.props.clickHandler} />
   </div>
  );
 }
}

class App extends React.Component {
 constructor(props) {
  super(props);

  this.state = {
   display: "0",
   firstValue: "0",
   operator: "",
   secondValue: "0",
   decimal: false,
   prevKeyType: ""
  };

  this.resetState = this.resetState.bind(this);
  this.calculate = this.calculate.bind(this);
  this.clickHandler = this.clickHandler.bind(this);
 }

 resetState() {
  this.setState({
   display: "0",
   firstValue: "0",
   operator: "",
   secondValue: "0",
   decimal: false,
   prevKeyType: ""
  });
 }

 calculate(firstValue, operator, secondValue) {
  let result = "";
  firstValue = parseFloat(firstValue);
  secondValue = parseFloat(secondValue);

  if (secondValue === 0) return;

  if (operator === "add") result = firstValue + secondValue;
  else if (operator === "subtract") result = firstValue - secondValue;
  else if (operator === "multiply") result = firstValue * secondValue;
  else if (operator === "divide") result = firstValue / secondValue;

  this.setState({
   display: result + "",
   firstValue: result + "",
   operator: "",
   secondValue: "0",
   decimal: false,
   prevKeyType: ""
  });
 }

 clickHandler(event) {
  const key = event.target;
  const action = key.dataset.action;
  const keyContent = key.textContent;
  const displayValue = this.state.display;

  
  if (!action) {
   if (this.state.display === "0" || this.state.prevKeyType === "operator") {
    this.setState({
     display: keyContent,
     prevKeyType: ""
    });
   } else {
    this.setState({
     display: displayValue + keyContent
    });
   }
  }

  
  if (
   action === "add" ||
   action == "subtract" ||
   action === "multiply" ||
   action === "divide"
  ) {
   this.setState({
    firstValue: displayValue,
    prevKeyType: "operator",
    operator: action
   });
  }

  if (action === "decimal") {
   if (this.state.decimal) return;
   this.setState({
    display: displayValue + ".",
    decimal: true
   });
  }

  if (action === "clear") {
   this.resetState();
  }

  if (action === "calculate") {
   const { firstValue, operator } = this.state;
   if (firstValue === "0") return;
   if (operator === "") return;

   const secondValue = this.state.display;
   this.calculate(firstValue, operator, secondValue);
  }
 }

 render() {
  return (
   <Calculator display={this.state.display} clickHandler={this.clickHandler} />
  );
 }
}

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
