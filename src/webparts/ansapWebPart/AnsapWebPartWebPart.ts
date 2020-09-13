import * as React from "react";
import * as ReactDom from "react-dom";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "AnsapWebPartWebPartStrings";
import AnsapWebPart from "./components/AnsapWebPart";

export default class AnsapWebPartWebPart extends BaseClientSideWebPart<any> {
  public render(): void {
    const element: React.ReactElement<any> = React.createElement(AnsapWebPart, {
      description: this.properties.description,
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
