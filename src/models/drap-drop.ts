// Drag & Drop Interfaces

namespace App {
  export interface Draggable {
    handleDragStart(event: DragEvent): void;
    handleDragEnd(event: DragEvent): void;
  }

  export interface DropTarget {
    handleDragOver(event: DragEvent): void;
    handleDrop(event: DragEvent): void;
    handleDragLeave(event: DragEvent): void;
  }
}
