// Project Component Base Class
export type InsertAtType = "beforeend" | "afterbegin";

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
