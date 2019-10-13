This submission was built initially in vanilla Js and then refactored implementing ES6 principles using 'rollup -c' to bundle the js.

Clicking inside the canvas spawns a ball with a random x & y velocity.

Some Next Steps if I were to take this further:

- User defined values. Allowing the user to pick the variables such as radius, mass, density, acceleration due to gravity, etc.
- Introduce friction. Currently it's assumed there is no friction between collisions (some energy is lost between walls and assumes perfect energy transfer between balls). Introducing this so balls behave appropriately whilst rolling across the floor and allowing the user to define the coeffecient of friction would add another factor.
- Testing. Unit testing some of the methods - I have had very minimal experience in JavaScript testing, but writing code in a testable way sets me up well to learn and the principles transfer over form Java very easily I'm sure. Implementing something such as Cypress.io for a full test suite - especially in the context involving an amount on entropy would be an interesting endeavour.
- Conversion to NodeJS/ReactJS
- User Experience and Accessibility - Important factors for developing a web application. Currently isn't responsive and the colours are just randomly generated instead of from a colourblind friendly palette. 
