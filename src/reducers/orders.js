/* eslint-disable default-case */
import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';
import { bindActionCreators } from 'C:/Users/DNS/AppData/Local/Microsoft/TypeScript/3.5/node_modules/redux';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

function comparisonIngredients(recipe, ingredients){
	let result = true;
	
	if(recipe.length !== ingredients.length){
			result = false;
			return result;
	}
	
	for(let i = 0; i < ingredients.length; i++){
			if(!recipe.includes(ingredients[i])) {
					result = false;
					return result
			}   
	}
	return true
}






export default (state = [], action) => {
  switch (action.type) {
		case 'CREATE_NEW_ORDER':
			return [
				...state,
				{
					id: action.payload.id,
					recipe: [...action.payload.recipe],
					ingredients: [],
					position: 'clients'					
				}
			]			
		case 'MOVE_ORDER_NEXT':
			return state.map(order => {
				if(order.id === action.payload){
					switch (order.position){
						case 'clients':
							return {...order, position: 'conveyor_1'}
						case 'conveyor_1':
							return {...order, position: 'conveyor_2'}
						case 'conveyor_2':
							return {...order, position: 'conveyor_3'}
						case 'conveyor_3':
							return {...order, position: 'conveyor_4'}
						case 'conveyor_4':
							let isEveryIngredientsPresent = comparisonIngredients(order.recipe, order.ingredients) 
							if (isEveryIngredientsPresent){
								return {...order, position: 'finish'} 	
							} else {
								return order
							}
					}
				} else {
					return order
				}
			})
		case 'MOVE_ORDER_BACK':
				return state.map(order => {
					if(order.id === action.payload){
						switch (order.position){
							case 'conveyor_2':
								return {...order, position: 'conveyor_1'}
							case 'conveyor_3':
								return {...order, position: 'conveyor_2'}
							case 'conveyor_4':
								return {...order, position: 'conveyor_3'}
							default:
      					return order;	
						}
					} else {
						return order
					}
				})
		case 'ADD_INGREDIENT':
				const newItem = action.payload.ingredient;
				const newState = state.map(item => {
					debugger
					const ingredients = item.ingredients;
					debugger
					return item.recipe.includes(newItem) ?
						{...item, ingredients: [...ingredients, newItem]} :
						item;
				});
				return newState;
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
