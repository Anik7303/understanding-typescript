interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Drag & Drop Interfaces
interface Draggable {
  handleDragStart(event: DragEvent): void;
  handleDragEnd(event: DragEvent): void;
}

interface DropTarget {
  handleDragOver(event: DragEvent): void;
  handleDrop(event: DragEvent): void;
  handleDragLeave(event: DragEvent): void;
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
type Listener<T> = (items: T[]) => void;

enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>): void {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
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

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus): void {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners(): void {
    for (let listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Project Component Base Class
type InsertAtType = "beforeend" | "afterbegin";
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAt: InsertAtType,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) this.element.id = newElementId;

    this.attach(insertAt);
  }

  attach(insertAt: InsertAtType): void {
    this.hostElement.insertAdjacentElement(insertAt, this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    return this.project.people > 1
      ? `${this.project.people} persons`
      : `${this.project.people} person`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, "beforeend", project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  handleDragStart(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  handleDragEnd(_: DragEvent): void {}

  configure(): void {
    this.element.addEventListener("dragstart", this.handleDragStart);
    this.element.addEventListener("dragend", this.handleDragEnd);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = `${this.persons} assigned`;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList Class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DropTarget
{
  private listElement: HTMLUListElement;
  private assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    super("project-list", "root", "beforeend", `${type}-projects`);

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status === this.type
      );
      this.renderProjects();
    });

    this.listElement = this.element.querySelector("ul")! as HTMLUListElement;

    this.configure();
    this.renderContent();
  }

  @autobind
  handleDragOver(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      this.listElement.classList.add("droppable");
    }
  }

  @autobind
  handleDrop(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(projectId, this.type);
  }

  @autobind
  handleDragLeave(_: DragEvent): void {
    this.listElement.classList.remove("droppable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.handleDragOver);
    this.element.addEventListener("drop", this.handleDrop);
    this.element.addEventListener("dragleave", this.handleDragLeave);
  }

  renderContent(): void {
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    this.listElement.id = `${this.type}-projects-list`;
  }

  private renderProjects(): void {
    this.listElement.innerHTML = "";

    for (let projectItem of this.assignedProjects) {
      new ProjectItem(this.listElement.id, projectItem);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.Active);
const finishedProjectList = new ProjectList(ProjectStatus.Finished);
