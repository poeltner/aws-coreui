import React, { Component } from 'react';
import Select from 'react-select';
import languages from './languages.json';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

class LanguageSelect extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  async handleChange(selectedOption) {
    const e = {
      target: {
        name: this.props.name,
        value: selectedOption['code']
      }
    }
    await this.props.onChange(e);
  }

  getValue = (value, options) => {
    if (!value) { return value }

    // If value is represented in the current options, just return that option.
    const currentOption = options.find(option => option['code'] === value);
    if (currentOption) { return currentOption }

    // If value is truthy but not contained in the options, it must be new.
    // Pass as an option object to satisfy react-select's Creatable value api.
    // Ref: https://github.com/JedWatson/react-select/issues/828
    return { 'code': value, name: value };
  };


  render() {
    // const { selectedOption } = this.state;
    const { t } = this.props;
    return (
      <div>
      <Select
        isSearchable 
        value={this.getValue(this.props.value, languages)}
        onChange={this.handleChange}
        options={languages.sort((a, b) => (t(a.name)).localeCompare(t(b.name)))}
        getOptionLabel={(option) => (t(option['name']))}
        getOptionValue={(option) => {
          return (option['code']);
        }}
      />
      </div>
    );
  }
}

LanguageSelect.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  t: PropTypes.any,
  value: PropTypes.string
}

export default withNamespaces('languages') (LanguageSelect);