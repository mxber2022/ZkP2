import { 
    Field, // The native number type in o1js. You can think of field elements as unsigned integers
    SmartContract, // The class that creates zkApp smart contracts.
    state, // A convenience decorator used in zkApp smart contracts to create references to state stored on-chain in a zkApp account.
    State, 
    method // A convenience decorator used in zkApp smart contracts to create smart contract methods like functions. Methods that use this decorator are the end user's entry points to interacting with a smart contract.
} from 'o1js';

export class Square extends SmartContract {
    /*
        num - smart contract state name
        field - type(unsigned integers) of num
    */
  @state(Field) num = State<Field>();

  // init method to set up the initial state of the smart contract on deployment:
  init() {
    super.init();
    this.num.set(Field(3));
  }

  /*
    Importantly, data passed as an input to a smart contract method in o1js is private and never seen by the network.
  */

  @method async update(square: Field) {
    /* 
        A smart contract retrieves the on-chain account state when it is first invoked if at least one get() exists within it.
    */
    const currentState = this.num.get();
    this.num.requireEquals(currentState);
    square.assertEquals(currentState.mul(currentState));
    /*
        Similarly, using set() changes the transaction to indicate that changes to this particular on-chain state are updated 
        only when the transaction is received by the Mina network if it contains a valid authorization (usually, 
        a valid authorization is a proof).
    */
    this.num.set(square);
  }
}