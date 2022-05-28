interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Autobind decorator
function autobind(
  _1: any,
  _2: string,
  desc: PropertyDescriptor
): PropertyDescriptor {
  const method = desc.value;
  return {
    configurable: true,
    enumerable: false,
    get() {
      return method.bind(this);
    },
  };
}

enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}

// Project Type
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// ProjectState Class
type Listener = (items: Project[]) => void;
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }

  addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  addProject(title: string, description: string, numberOfPeople: number): void {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (let listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// ProjectList Class
class ProjectList {
  private templateElement: HTMLTemplateElement;
  private hostElement: HTMLDivElement;
  private element: HTMLUListElement;
  private assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("root")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLUListElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((project: Project) => {
        return project.status === this.type;
      });
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (let projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private configure(): void {}

  private attach(): void {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// ProjectInput Class
class ProjectInput {
  private templateElement: HTMLTemplateElement;
  private hostElement: HTMLDivElement;
  private element: HTMLFormElement;

  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById("root") as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

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
    this.attach();
  }

  private validate(validatableValue: Validatable): boolean {
    const { value } = validatableValue;
    let isValid = true;

    if (validatableValue.required) {
      isValid = isValid && value.toString().trim().length > 0;
    }
    if (validatableValue.minLength != null && typeof value === "string") {
      isValid = isValid && value.trim().length >= validatableValue.minLength;
    }
    if (validatableValue.maxLength != null && typeof value === "string") {
      isValid = isValid && value.trim().length <= validatableValue.maxLength;
    }
    if (validatableValue.min != null && typeof value === "number") {
      isValid = isValid && value >= validatableValue.min;
    }
    if (validatableValue.max != null && typeof value === "number") {
      isValid = isValid && value <= validatableValue.max;
    }

    return isValid;
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
      !this.validate(validateTitle) ||
      !this.validate(validateDescription) ||
      !this.validate(validatePeople)
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

  private configure(): void {
    this.element.addEventListener("submit", this.handleSubmit);
  }

  private attach(): void {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.Active);
const finishedProjectList = new ProjectList(ProjectStatus.Finished);
