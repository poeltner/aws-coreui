/* eslint-disable react/display-name */
import React, {Component} from 'react';
import NotificationAlert from 'react-notification-alert';
import Log from '../Logger/Log';

export function withAlert(Comp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.error = this.error.bind(this);
      this.alert = this.alert.bind(this);
    }

    error(err) {
      Log.error(err, 'Utils.Alert');
      const options = {
        place: 'tl',
        message: (
            <div>
                <div>
                    { (err.message)?
                        err.message:
                        err
                    }
                </div>
            </div> 
        ),
        type: "danger",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 7
      };
      this.notify.notificationAlert(options);
    }

    alert(msg) {
      
      Log.info(msg, 'Utils.Alert');
      const options = {
        place: 'tl',
        message: (
            <div>
                <div>
                    { (msg.message)?
                        msg.message:
                        msg
                    }
                </div>
            </div> 
        ),
        type: "success",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 7
      };
      this.notify.notificationAlert(options);
    }

    render() {
      return (
        <div>
          <NotificationAlert ref={(c) => { this.notify = c }} />
          <Comp
              {...this.props}
              errorAlert={this.error}
              alert={this.alert}
          />
        </div>
              
      );
    }
  };
}