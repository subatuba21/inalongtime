import {DraftType} from '../../types/draft';
import {Component} from './component';

export type ContentType = DraftType;

export class Content extends Component {
  initialized: boolean = false;
  data?: any;
  type?: ContentType;

  constructor() {
    super();
  }

  serialize() : object {
    return {};
  }

  deserialize(data: any) {
    this.initialized = true;
  }

  initialize(args: any) {
    this.initialized = true;
  }
}
