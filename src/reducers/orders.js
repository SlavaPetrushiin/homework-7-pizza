import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';
import { bindActionCreators } from 'C:/Users/DNS/AppData/Local/Microsoft/TypeScript/3.5/node_modules/redux';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

const OrdersPositions = {
  clients: { next: 'conveyor_1', prev: null },
  conveyor_1: { next: 'conveyor_2', prev: 'conveyor_1' },
  conveyor_2: { next: 'conveyor_3', prev: 'conveyor_1' },
  conveyor_3: { next: 'conveyor_4', prev: 'conveyor_2' },
  conveyor_4: { next: 'finish', prev: 'conveyor_3' }
};

function moveOrderNext(state, action){
	const id = action.payload;
	let newState = [...state];
	newState.forEach((order) => {
		if(order.id === id){
			for (let key in OrdersPositions){
				if (order.position === key){
					if(OrdersPositions[key].next === 'finish' && order.ingredients.length <  order.recipe.length){
						return;
					} else {
						order.position = OrdersPositions[key].next;
						return;
					}
				};
			}  
		}		
	})
	return newState;
}

function moveOrderBack(state, action){
	let newState = [...state];
	newState.forEach((order) => {
		if(order.id === action.payload){
			for (let key in OrdersPositions){
				if (order.position === key){
						order.position = OrdersPositions[key].prev
						return
				};
			}  
		}		
	})
	return newState;
}

function pushIngredients(state, action){
	let newState = [...state];
	const { from, ingredient } = action.payload;

	newState.forEach(order => {
		if(order.position === from && order.recipe.indexOf(ingredient) !== -1){
			order.ingredients.push(ingredient);
		}
	})

	return newState;
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
			return moveOrderNext(state, action);
		case 'MOVE_ORDER_BACK':
			return moveOrderBack(state, action);
		case 'ADD_INGREDIENT':
			return pushIngredients(state, action);
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
