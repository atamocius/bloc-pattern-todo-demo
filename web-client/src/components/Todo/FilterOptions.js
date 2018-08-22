import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export class Filter {
  static all = 'all';
  static active = 'active';
  static completed = 'completed';
}

class FilterOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter: Filter.all,
    };
  }

  render() {
    const { activeItemsCount } = this.props;
    const { selectedFilter } = this.state;

    const itemsLeft =
      activeItemsCount > 1 ? `${activeItemsCount} items left` : `1 item left`;

    return (
      <Menu>
        <Menu.Item>{itemsLeft}</Menu.Item>
        <Menu.Item
          active={selectedFilter === Filter.all}
          name={Filter.all}
          onClick={() => this._changeFilter(Filter.all)}
        />
        <Menu.Item
          active={selectedFilter === Filter.active}
          name={Filter.active}
          onClick={() => this._changeFilter(Filter.active)}
        />
        <Menu.Item
          active={selectedFilter === Filter.completed}
          name={Filter.completed}
          onClick={() => this._changeFilter(Filter.completed)}
        />
      </Menu>
    );
  }

  _changeFilter(filter) {
    this.setState({
      selectedFilter: filter,
    });

    this.props.onFilterChange(filter);
  }
}

export default FilterOptions;
