import React, { Fragment } from 'react';
import { Menu } from 'semantic-ui-react';

import TodoContext from './TodoContext';
import StreamBuilder from '../../utils/StreamBuilder';

export class Filter {
  static all = 'all';
  static active = 'active';
  static completed = 'completed';
}

const FilterOptions = () => (
  <TodoContext.Consumer>
    {bloc => (
      <Menu>
        <Menu.Item>
          <StreamBuilder
            stream={bloc.activeCount}
            builder={snapshot =>
              snapshot.data > 1 ? `${snapshot.data} items left` : `1 item left`
            }
          />
        </Menu.Item>
        <StreamBuilder
          stream={bloc.filter}
          builder={snapshot => (
            <Fragment>
              <Menu.Item
                active={snapshot.data === Filter.all}
                name={Filter.all}
                onClick={() => (bloc.filter = Filter.all)}
              />
              <Menu.Item
                active={snapshot.data === Filter.active}
                name={Filter.active}
                onClick={() => (bloc.filter = Filter.active)}
              />
              <Menu.Item
                active={snapshot.data === Filter.completed}
                name={Filter.completed}
                onClick={() => (bloc.filter = Filter.completed)}
              />
            </Fragment>
          )}
        />
      </Menu>
    )}
  </TodoContext.Consumer>
);

export default FilterOptions;
