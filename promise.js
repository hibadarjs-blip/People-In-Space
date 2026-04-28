const order = true; // It happens to control our order state.

const breakfastPromise = new Promise( (resolve, reject) => {
    setTimeout( ()=> {
        if (order) {
            resolve('Your order is ready. Come and get it!');
        } else {
            reject(Error('Oh no! There was an error with your order.'));
        }
    
    }, 3000); // 3000 ms = 3 s
});

console.log(breakfastPromise);
breakfastPromise
.then(val => console.log(val)) //If promise resolves.
.catch(err => console.log(err)); //If rejected.