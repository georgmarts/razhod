const { useState, useEffect, useContext, useRef } = React;

function App() {

    const LOCAL_STORAGE_KEY = 'expensesApp.expenses'

    const [userInput, setUserInput] = useState('')
    const [expenses, setExpenses] = useState([])

    const [isEditing, setIsEditing] = useState(false);
    const [currentExpense, setCurrentExpense] = useState();

    const [initId, setId] = useState(0)
    const incrementCount = () => {
        setId(initId + 1);
      };

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (storedExpenses) setExpenses(storedExpenses)
      }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses))
      },
  
      [expenses])


    useEffect(()=>{incrementCount()}, [expenses])
    
    const handleAmmountChange = (e) => {
        setUserInput(e.target.value)     
    }

    const handleClick = (e)=> {
        e.preventDefault()
        const d = new Date();
        let month = String(d.getMonth() + 1).padStart(2, '0');
        let date = String(d.getDate()).padStart(2, '0');
        let year = d.getFullYear()
        if (userInput === '') {return null}      
        setExpenses([...expenses, {id: initId, ammount: userInput, date: date, month: month, year: year, active: false}])
        setUserInput('')
    }

    const handleEditClick = (arg) => {
        setIsEditing(prevCheck => !prevCheck)
        expenses.map(x=>x.id === arg.id ? x.active = true : x.active = false)
        setCurrentExpense({...arg})
        console.log(expenses)
    }

    const handleEditInput = (e) => {
        setCurrentExpense({...currentExpense, ammount: e.target.value})
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()
        handleUpdateExpense(currentExpense.id, currentExpense);
    }

    function handleUpdateExpense(id, updatedExpense) {

        const updatedItem = expenses.map((expense) => {
          return expense.id === id ? updatedExpense : expense;
        });
        setIsEditing(false);
        setExpenses(updatedItem);
      }

    function handleExpenseDelete(id) {
        const updatedItem = expenses.filter((expense) => {
            return expense.id !== id;
          });
        setExpenses(updatedItem);
    }

    const sum = expenses.reduce((a, b) => Number(a) + Number(b.ammount), 0)

    const filtered = expenses.filter(x=>x.month = '01')
    const sumPerMonth = filtered.reduce((a, b) => Number(a) + Number(b.ammount), 0)

return <main>
    <form onSubmit = {handleClick}>
        <label htmlFor="ammount">Ammount:</label>
        <input value={userInput} type="text" id="ammount" name="ammount" placeholder="enter the ammout" onChange={handleAmmountChange}/><br/>
        <input type="submit" value="Submit"/>
    </form>
    <section>
        <>
        {expenses.slice(0).reverse().map((x, index)=>{
            let thisId = x.id
        return <div key={index}>
            <p>Ammount: {x.ammount} Date: {x.date}/{x.month}/{x.year}  ID: {x.id}</p>
            <button onClick={()=>handleEditClick(x)}>click</button>
            {isEditing? <form onSubmit={handleEditSubmit} style={x.active ? { display: 'block'} : {display: 'none'}}><input type='text' onChange={handleEditInput}/>
            <input type='submit'/></form> : null}
            <button onClick={()=>handleExpenseDelete(thisId)}>delete</button>
            </div>})}
        <h1>{sum}</h1>
        <h1>Expenses for January: {sumPerMonth}</h1>
        </>
    
    </section>
    </main>

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)
