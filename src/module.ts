import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'staticPrefix',
      name: 'Static Prefix',
      description: 'A static prefix that will be added to the beginning of video assets.',
      defaultValue: '',
    })
});
