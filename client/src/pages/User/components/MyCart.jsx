import {UserNavLinks} from "./UserNavLinks";
import "../styles/Cart.css"
import {CartComponent} from "./CartComponent";

export const MyCart = ({user}) => {
    return (
        <div className="myAccount">
            {/* <UserNavLinks /> */}
            <CartComponent user={user}/>
        </div>
    );
}