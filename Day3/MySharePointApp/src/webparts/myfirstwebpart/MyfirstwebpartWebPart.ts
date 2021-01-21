import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './MyfirstwebpartWebPart.module.scss';
import * as strings from 'MyfirstwebpartWebPartStrings';
import {MSGraphClient} from '@microsoft/sp-http';

export interface IMyfirstwebpartWebPartProps {
  description: string;
  mySlider:string;
  mySelect:string;
  myChoice:boolean;
}

export default class MyfirstwebpartWebPart extends BaseClientSideWebPart<IMyfirstwebpartWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.myfirstwebpart }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <ul class="${ styles.subTitle }"></ul>
              <p class="${ styles.description }">${escape(this.properties.description)} </p>
              <p><h2>% of Work Completion</h2>${escape(this.properties.mySlider)} </p>
              <p><h2>Team</h2>${escape(this.properties.mySelect)} </p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    this.context.msGraphClientFactory
    .getClient()
    .then((client:MSGraphClient)=>{
      client.api("https://graph.microsoft.com/v1.0/me")
      .get((error,response:any,rawResponse:any)=>{
        console.log(error);
        console.log(response)
        if(!error){
          let myData ="";
          myData+= "<li>"+response.displayName+"</li>";
          myData+= "<li>"+response.mail+"</li>";
          document.getElementsByClassName(styles.subTitle)[0].innerHTML=myData;
        }
      });
    });


  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  public ValidateData(value:string){
    if(value.length==0)
        return "Description canno be empty";
    else
        return "";
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Please enter the data",onGetErrorMessage:this.ValidateData.bind(this)
                }),
                PropertyPaneSlider("mySlider",{min:0,max:100,label:"Completion %"}),
                PropertyPaneCheckbox("myChoice",{text:"Is the work Approved??"}),
                PropertyPaneDropdown("mySelect",{label:"Select your team",options:[
                  {
                    key:"The A-Team",
                    text:"A-Team"
                  },
                  {
                    key:"The Expendables",
                    text:"Expendables"
                  },
                  {
                    key:"The King Cobra",
                    text:"King Cobra"
                  }
                ]})
              ]
            }
          ]
        }
      ]
    };
  }
}
