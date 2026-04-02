import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Trash2, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { useSearchTree } from '../hooks/useSearchTree.js';

function TreeNode({ nodeId, tree, level = 0, onSelectNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const node = tree.nodes[nodeId];

  if (!node) return null;

  const children = node.children || [];
  const hasChildren = children.length > 0;
  const isCurrentNode = tree.currentNodeId === nodeId;

  return (
    <div className="select-none">
      <div
        className={clsx(
          'flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors text-xs',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          isCurrentNode ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-gray-300'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelectNode(nodeId)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <span className="flex-1 truncate">
          {node.label}
        </span>

        <span className="text-gray-400 dark:text-gray-500 text-[10px]">
          {formatTime(node.timestamp)}
        </span>
      </div>

      {isOpen && hasChildren && (
        <div>
          {children.map(childId => (
            <TreeNode
              key={childId}
              nodeId={childId}
              tree={tree}
              level={level + 1}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchTree({ onSelectSearch, isOpen = true }) {
  const { tree, getRootNodes, clearHistory, setCurrentNode } = useSearchTree();

  if (!tree) {
    return null;
  }

  const rootNodes = getRootNodes();
  const isEmpty = rootNodes.length === 0;

  const handleSelectNode = (nodeId) => {
    setCurrentNode(nodeId);
    const node = tree.nodes[nodeId];
    if (node && onSelectSearch) {
      onSelectSearch(node.params);
    }
  };

  return (
    <div className={clsx(
      'hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
      !isOpen && 'hidden'
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
          Search History
          {!isEmpty && (
            <button
              onClick={clearHistory}
              title="Clear all history"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
        </h2>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0">
        {isEmpty ? (
          <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>No searches yet</p>
            <p className="mt-1 text-[10px]">Your search history will appear here</p>
          </div>
        ) : (
          rootNodes.map(node => (
            <TreeNode
              key={node.id}
              nodeId={node.id}
              tree={tree}
              onSelectNode={handleSelectNode}
            />
          ))
        )}
      </div>

      {/* Info */}
      {!isEmpty && (
        <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
          Click a search to reload it
        </div>
      )}
    </div>
  );
}

/**
 * Format timestamp to "2m ago", "1h ago", etc.
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
