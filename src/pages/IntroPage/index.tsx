import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setUsername } from '../../store/app/state';

/* *************************** */
//    MAP DISPATCH TO PROPS    //
/* *************************** */

interface IMapDispatchToProps {
 	setUsername: (username: string) => void;
};

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
	setUsername: (username) => dispatch(setUsername({username})),
})

class Intro extends React.PureComponent<IMapDispatchToProps> {
	public state = {
		username: ''
	}

	public render() {
		return(
			<div className="intro">
				<form onChange={this.handleInputChange} onSubmit={this.handleSubmitUsername}>
					<label>Olá! Que bom vê-lo por aqui, pode me dizer o seu nome?</label>
					<div>
						<i className="fas fa-arrow-right"/>
						<input name="username" value={this.state.username} />
					</div>
					<div>
						<button>Ok <i className="fas fa-check"/></button>
						<p>pressione <span>ENTER</span></p>
					</div>
				</form>
			</div>
		);
	}

	private handleInputChange = (event: any) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	private handleSubmitUsername = (event: any) => {
		event.preventDefault();
		this.props.setUsername(this.state.username);
	}
}

export default connect(null, mapDispatchToProps)(Intro);
