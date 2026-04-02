/**
 * Search Tree Hook
 * Manages search history as a tree structure with parent/child relationships
 * Each search is a node that can have child searches
 * Tree is persisted in localStorage
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tripoptimizer_searchTree';

export function useSearchTree() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tree from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTree(JSON.parse(stored));
      } else {
        // Initialize empty tree
        setTree({
          nodes: {},
          rootIds: [],
          currentNodeId: null
        });
      }
    } catch (error) {
      console.error('Failed to load search tree:', error);
      setTree({
        nodes: {},
        rootIds: [],
        currentNodeId: null
      });
    }
    setLoading(false);
  }, []);

  // Save tree to localStorage whenever it changes
  useEffect(() => {
    if (tree) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
      } catch (error) {
        console.error('Failed to save search tree:', error);
      }
    }
  }, [tree]);

  /**
   * Add a new search to the tree
   * If parentNodeId is provided, it becomes a child of that node
   * Otherwise, it becomes a root node
   */
  const addSearch = useCallback((searchParams, parentNodeId = null) => {
    setTree(prev => {
      if (!prev) return prev;

      const nodeId = Date.now().toString();
      const now = new Date().toISOString();

      const newNode = {
        id: nodeId,
        parentId: parentNodeId,
        children: [],
        params: searchParams,
        timestamp: now,
        label: formatSearchLabel(searchParams)
      };

      const updated = { ...prev };
      updated.nodes[nodeId] = newNode;

      if (parentNodeId && updated.nodes[parentNodeId]) {
        // Add as child
        if (!updated.nodes[parentNodeId].children) {
          updated.nodes[parentNodeId].children = [];
        }
        updated.nodes[parentNodeId].children.push(nodeId);
      } else {
        // Add as root
        updated.rootIds = [nodeId, ...updated.rootIds].slice(0, 20); // Keep last 20 roots
      }

      updated.currentNodeId = nodeId;
      return updated;
    });
  }, []);

  /**
   * Get node by ID
   */
  const getNode = useCallback((nodeId) => {
    if (!tree || !tree.nodes) return null;
    return tree.nodes[nodeId];
  }, [tree]);

  /**
   * Get all root nodes
   */
  const getRootNodes = useCallback(() => {
    if (!tree || !tree.rootIds) return [];
    return tree.rootIds.map(id => tree.nodes[id]).filter(Boolean);
  }, [tree]);

  /**
   * Get children of a node
   */
  const getChildren = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (!node || !node.children) return [];
    return node.children.map(id => tree.nodes[id]).filter(Boolean);
  }, [tree, getNode]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setTree({
      nodes: {},
      rootIds: [],
      currentNodeId: null
    });
  }, []);

  /**
   * Get current node
   */
  const getCurrentNode = useCallback(() => {
    if (!tree || !tree.currentNodeId) return null;
    return getNode(tree.currentNodeId);
  }, [tree, getNode]);

  /**
   * Set current node (when user clicks a search in tree)
   */
  const setCurrentNode = useCallback((nodeId) => {
    setTree(prev => {
      if (!prev) return prev;
      return { ...prev, currentNodeId: nodeId };
    });
  }, []);

  return {
    tree,
    loading,
    addSearch,
    getNode,
    getRootNodes,
    getChildren,
    getCurrentNode,
    setCurrentNode,
    clearHistory,
    currentNodeId: tree?.currentNodeId
  };
}

/**
 * Format search params into a readable label
 */
function formatSearchLabel(params) {
  if (!params) return 'Search';

  const origin = params.origin || '?';
  const dest = params.destination || '?';
  const date = params.startDate ? new Date(params.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?';

  return `${origin} → ${dest} (${date})`;
}
