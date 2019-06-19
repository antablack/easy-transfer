import { Component, h } from '@stencil/core';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  render() {
    return (
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url='/' component='app-upload' exact={true} />
              <stencil-route url='/download' component='app-download' />
            </stencil-route-switch>
          </stencil-router>
        </main>
    );
  }
}
