import { Component } from "./base-component";
import { projectState } from "../state/project";
import { autobind } from "../decorators/autobind";
import { validate, Validatable } from "../utils/validation";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "root", "afterbegin", "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  renderContent(): void {}

  configure(): void {
    this.element.addEventListener("submit", this.handleSubmit);
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    const validateTitle: Validatable = {
      value: title,
      required: true,
      minLength: 5,
    };
    const validateDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const validatePeople: Validatable = {
      value: people,
      required: true,
      min: 2,
      max: 10,
    };

    if (
      !validate(validateTitle) ||
      !validate(validateDescription) ||
      !validate(validatePeople)
    ) {
      alert("Invalid input. Please try again.");
      return;
    }
    return [title, description, parseFloat(people)];
  }

  private clearInputs(): void {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "2";
  }

  @autobind
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;

      projectState.addProject(title, description, people);

      this.clearInputs();
    }
  }
}
