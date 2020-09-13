import * as React from "react";
import styles from "./AnsapWebPart.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Select from "react-select";
import { IItemAddResult } from "@pnp/sp/items";

interface IProps {
  description: string;
  context: WebPartContext;
}

interface IState {
  states: string[];
  options: Object[];
  modal: boolean;
  name: string;
  descr: string;
  place: Object;
}

export default class AnsapWebPart extends React.Component<IProps, IState> {
  public state = {
    states: null,
    options: [],
    modal: false,
    name: "",
    descr: "",
    place: { value: "Best place to visit" },
  };

  public async componentDidMount() {
    sp.setup({
      spfxContext: this.props.context,
    });
    const response = await sp.web.lists
      .getByTitle("mainList")
      .items.select(
        "Id",
        "Title",
        "Description",
        "Visited",
        "Transport",
        "places/Id",
        "places/Title",
        "places/Source0"
      )
      .expand("places")
      .get();
    const placesList = await sp.web.lists
      .getByTitle("placesList")
      .items.select("Id", "Title")
      .get();
    const options = [];
    placesList.map((el) => options.push({ value: el.Id, label: el.Title }));
    this.setState({
      options,
      states: response,
    });
  }

  public handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  public handleDescrChange = (e) => {
    this.setState({
      descr: e.target.value,
    });
  }

  public handlePlaceChange = (val) => {
    this.setState({
      place: val,
    });
  }

  public handleSubmit = async (e) => {
    e.preventDefault();
    const { name, descr, place } = this.state;
    try {
      const iar: IItemAddResult = await sp.web.lists
        .getByTitle("mainList")
        .items.add({
          Title: name,
          Visited: false,
          placesId: place.value,
          Description: descr,
        });
      console.log(iar);
      this.toggleModal();
    } catch (err) {
      console.log(err);
    }
  }

  public toggleModal = () => {
    this.setState((prev) => {
      return {
        modal: !prev.modal,
      };
    });
  }

  public render(): React.ReactElement<IProps> {
    const { states, modal, name, descr, place, options } = this.state;
    return (
      <div className={styles.ansapWebPart}>
        <div className={styles.container}>
          <div className={styles.row}>
            <h2 className={styles.title}>Most visited USA states:</h2>
            <ul className={styles.statesList}>
              {states !== null &&
                states.map((item: any) => (
                  <li key={item.Id} className={styles.listItem}>
                    <h3>{item.Title}</h3>
                    <p>{item.Description}</p>
                    <p className={styles.itemText}>
                      <span>Best place to visit here:</span>
                      <a
                        href={item.places.Source0}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.places.Title}
                      </a>
                    </p>
                  </li>
                ))}
            </ul>

            <button
              type="button"
              className={styles.addBtn}
              onClick={this.toggleModal}
            >
              Add New State
            </button>

            {modal && (
              <form onSubmit={this.handleSubmit} className={styles.form}>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleNameChange}
                  placeholder="State Name"
                  className={styles.formInput}
                ></input>
                <input
                  type="text"
                  name="descr"
                  value={descr}
                  onChange={this.handleDescrChange}
                  placeholder="Description"
                  className={styles.formInput}
                ></input>

                <div>
                  <Select
                    options={options}
                    value={place}
                    onChange={this.handlePlaceChange}
                    placeholder="Best place to visit"
                    autosize={true}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Add
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}
