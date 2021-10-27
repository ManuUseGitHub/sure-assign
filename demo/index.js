/* eslint-disable @typescript-eslint/no-var-requires */
const { ConsistentAssigner } = require( "../sure-assign/index.js" );

// TODO : manipulate the service
const assigner = new ConsistentAssigner ();

const objA = { Hello : "word" , this_ : "is" , something : "that is" , so : "cool" };
const objB = { cool : "world" , but : "yet" , something : "yet" , so : "strict" };
const objC = { so : "strict" };

const newlyAssigned = assigner.assign( objA , objB , objC );

console.log( newlyAssigned );