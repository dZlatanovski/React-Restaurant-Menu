import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//menu item component
class MenuItem extends React.Component{
    render(){
        return(
           this.props.generateMenuItemContents.bind(this)(this.props.isMenuItem)
        )
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //all the items that are displayed on the menu
            menuItems: [
            this.generateMenuItem(0, this.menuItemhandler, "Sushi", "400",true, this.orderItemHandler),
            this.generateMenuItem(1, this.menuItemhandler, "Onigiri", "150",true, this.orderItemHandler),            
            this.generateMenuItem(2, this.menuItemhandler, "Takoyaki", "250",true, this.orderItemHandler),
            this.generateMenuItem(3, this.menuItemhandler, "Ramen", "300",true, this.orderItemHandler),
            this.generateMenuItem(4, this.menuItemhandler, "Miso Soup", "180",true, this.orderItemHandler),
            this.generateMenuItem(5, this.menuItemhandler, "Omurice", "300",true, this.orderItemHandler),
            this.generateMenuItem(6, this.menuItemhandler, "Sashimi", "600",true, this.orderItemHandler),
            this.generateMenuItem(7, this.menuItemhandler, "Mochi", "100",true, this.orderItemHandler),
            this.generateMenuItem(8, this.menuItemhandler, "Yakiniku", "500",true, this.orderItemHandler),                                    
            this.generateMenuItem(9, this.menuItemhandler, "Green Tea", "50",true, this.orderItemHandler),

            ],
            orderItems: [],
            keyCounter: 11,
            sum: "0",
        }
    }

    //click event handler function for the "order" buttons on the menu items
    menuItemhandler(i){
        document.getElementById(i.toString()).blur();
        if(this.state.orderItems.length === 9)
            return;
        let menuItemsCopy = this.state.menuItems;
        let index = this.state.keyCounter;
        let newKeyCounter = this.state.keyCounter + 1;
        let orderItemsCopy = this.state.orderItems;
        let position1 = orderItemsCopy.length === 0 ? 0 : orderItemsCopy.length - 1;
        let currentMenuItem = this.generateMenuItem(
            index, this.menuItemhandler, menuItemsCopy[i].props.value, menuItemsCopy[i].props.price,
            false, this.orderItemHandler, position1
        );
        orderItemsCopy[position1] = (currentMenuItem);        
        let position2 = orderItemsCopy.length === 0 ? 1 : orderItemsCopy.length;
        if(position2 === 1){
            let newSum = orderItemsCopy[0].props.price.toString();              
            orderItemsCopy[1] =
            <div key={0} className="lastDiv">
                <div className="totalPrice">
                    Total Price: {newSum}
                </div>
                <div className="totalPrice">
                    <button onClick={this.completeOrderHandler.bind(this)} id="completeOrder" type="button" className="btn btn-success">
                        Complete order
                    </button>
                </div>
            </div> ;
            this.setState({
                menuItems: menuItemsCopy,
                orderItems: orderItemsCopy,
                keyCounter: newKeyCounter,
                sum: newSum 
            });
        }
        else{
            orderItemsCopy[position2] = this.calculateTotal.bind(this)(orderItemsCopy);
            this.setState({
                menuItems: menuItemsCopy,
                orderItems: orderItemsCopy,
                keyCounter: newKeyCounter, 
            });
        }
    }

    //click event handler function for the "remove" buttons on each item of the order list
    orderItemHandler(i,that){
        let orderItemsCopy = that.state.orderItems;
        orderItemsCopy.splice(i,1);
        orderItemsCopy.pop();
        if(orderItemsCopy.length === 0){
            that.setState({
                orderItems: orderItemsCopy
            });
            return;
        }
        for(let j = 0; j < orderItemsCopy.length; j++){
            let currentMenuItem = that.generateMenuItem(
                orderItemsCopy[j].props.id, orderItemsCopy[j].props.menuItemHandler,
                orderItemsCopy[j].props.value, orderItemsCopy[j].props.price,
                false, that.orderItemHandler, j
            );
            orderItemsCopy[j] = (currentMenuItem);
        }
        orderItemsCopy[orderItemsCopy.length] = that.calculateTotal.bind(that)(orderItemsCopy);                 
        that.setState({
            orderItems: orderItemsCopy
        });
    }

    //a function that generates a menu item component
    generateMenuItem(index, menuHandlerFunc, valueArg, price, isMenuItem, orderHandlerFunc, i){
        return(
            <MenuItem key={index} id={index} menuItemHandler={() => menuHandlerFunc.bind(this)(index)} value={valueArg} price={price}
            isMenuItem={isMenuItem} generateMenuItemContents={this.generateMenuItemContents}
            orderItemHandler={orderHandlerFunc} i={i} _that={this}
            />
        )
    }

    //a function that calculates the total price by summing up all the prices of all the items in the order list
    calculateTotal(orderList){
        let sum = 0;
        for(let i = 0; i < orderList.length; i++){
            sum += parseInt(orderList[i].props.price,10);
        }
        this.setState({
            sum: sum
        });
        return (
            <div key={0} className="lastDiv">
                <div className="totalPrice">
                    Total Price: {sum.toString()}
                </div>
                <div className="totalPrice">
                    <button onClick={this.completeOrderHandler.bind(this)} id="completeOrder" type="button" className="btn btn-success">
                        Complete order
                    </button>
                </div>
            </div>
        )
    }

    //a function that generates the contents of each item accordingly if it's a menu list item or an order list item
    generateMenuItemContents(isMenuItem){
        if(isMenuItem){
            return(
                <div className="menuItem">
                    <h1 className="menuItemHeader">{this.props.value}</h1>
                    <div className="priceMenu">Price: {this.props.price}</div> 
                    <button id={this.props.id} type="button" onClick={this.props.menuItemHandler} className="btn btn-dark">
                        Order
                    </button>                
                </div>
            )
        } else{
            return(
                <div className="menuItem">
                        <h1 className="orderItemHeader">{this.props.value}</h1>
                        <div className="priceOrder">Price: {this.props.price}</div>
                        <button type="button" onClick={() => this.props.orderItemHandler(this.props.i,this.props._that)} className="btn btn-danger removeBtn">
                            Remove
                        </button>                                                       
                </div>
            )
        }
    }

    //click event handler function for the "complete order" button
    completeOrderHandler(){
        document.getElementById("completeOrder").blur();
        alert("Order list sent!\nTotal Price: " + this.state.sum.toString() + ".");
        this.setState({
            orderItems: [],
            keyCounter: 11
        })
    }

    render(){

        return(
            <div>
                <h1 className="whatever">Menu</h1>
                <div className="menuContainer">
                    {this.state.menuItems}
                </div>
                <h1 className="whatever">Order List</h1>
                <div className="orderListContainer">
                    {this.state.orderItems}
                </div>
            </div>
        )

    }


}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)