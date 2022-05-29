import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { Draggable } from "../models/drap-drop.js";
import { Project } from "../models/project.js";

// ProjectItem Class
export class ProjectItem
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
