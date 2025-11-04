import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  IconButton,
  Heading,
  Divider,
  Text,
  Tag,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import {
  useGetKonwledgeBase,
  useCreateKnowledgeBase,
  useUpdateKnowledgeBase,
  useDeleteKnowledgeBase,
} from "@/libs/Hooks/knowledgeBaseHook";
import usePropertyChatStore from "@/store/propertyChatStore";
import LoadingSpinner from "@/libs/Components/loadingSpinner";
import { toast } from "react-toastify";

// ✅ ID is now a string
export type KBId = string;

export interface KnowledgeItemData {
  id: KBId;
  question: string;
  answer: string;
}

const KnowledgeItem: React.FC<{
  item: KnowledgeItemData;
  isEditing: boolean;
  onStartEdit: (item: KnowledgeItemData) => void;
  onCancelEdit: () => void;
  onSave: (id: KBId, q: string, a: string) => void;
  onDelete: (id: KBId) => void;
}> = ({ item, isEditing, onStartEdit, onCancelEdit, onSave, onDelete }) => {
  const [q, setQ] = useState(item.question);
  const [a, setA] = useState(item.answer);

  // Handle accordion button click - prevent default behavior when editing
  const handleAccordionClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <AccordionItem borderWidth={1} borderRadius="md" mb={3}>
      <h2>
        <AccordionButton
          onClick={handleAccordionClick}
          cursor={isEditing ? "default" : "pointer"}
          _hover={isEditing ? {} : { bg: "gray.50" }}
        >
          <Box flex="1" textAlign="left">
            {isEditing ? (
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Question"
                onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
              />
            ) : (
              <Text fontWeight="semibold">{item.question}</Text>
            )}
          </Box>
          {!isEditing && <AccordionIcon />}
        </AccordionButton>
      </h2>

      <AccordionPanel pb={4}>
        {isEditing ? (
          <Textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Answer"
            onClick={(e) => e.stopPropagation()} // Prevent any event bubbling
          />
        ) : (
          <Text whiteSpace="pre-wrap">{item.answer}</Text>
        )}

        <Flex mt={3} justify="flex-end" gap={2} wrap="wrap">
          {isEditing ? (
            <>
              <IconButton
                aria-label="Save"
                icon={<CheckIcon />}
                size="sm"
                colorScheme="green"
                onClick={() => onSave(item.id, q, a)}
              />
              <IconButton
                aria-label="Cancel"
                icon={<CloseIcon />}
                size="sm"
                onClick={onCancelEdit}
              />
            </>
          ) : (
            <>
              <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent accordion toggle when clicking edit
                  onStartEdit(item);
                }}
              />
              <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent accordion toggle when clicking delete
                  onDelete(item.id);
                }}
              />
            </>
          )}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

const KnowledgeBaseManager: React.FC = () => {
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );

  const {
    data: knowledgeBaseData,
    isLoading,
    isError,
  } = useGetKonwledgeBase(selectedProperty);

  const [items, setItems] = useState<KnowledgeItemData[]>([]);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editingId, setEditingId] = useState<KBId | null>(null);
  const createKnowledgeBaseMutation = useCreateKnowledgeBase();
  const updateKnowledgeBaseMutation = useUpdateKnowledgeBase();
  const deleteKnowledgeBaseMutation = useDeleteKnowledgeBase();
  const [loading, setLoading] = useState(false);

  // Load knowledge base from API
  useEffect(() => {
    if (knowledgeBaseData) {
      setItems(knowledgeBaseData);
    }
  }, [knowledgeBaseData]);

  const isDuplicate = useMemo(() => {
    const q = newQ.trim().toLowerCase();
    return !!q && items.some((i) => i.question.trim().toLowerCase() === q);
  }, [newQ, items]);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const q = newQ.trim();
      const a = newA.trim();
      if (!q || !a || isDuplicate) return;

      const response = await createKnowledgeBaseMutation.mutateAsync({
        question: q,
        answer: a,
        siteId: selectedProperty,
      });

      setItems((prev) => [...prev, response.newKnowledgeBase]);

      setNewQ("");
      setNewA("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: KBId, q: string, a: string) => {
    try {
      setLoading(true);
      if (!q.trim() || !a.trim()) return;

      const response = await updateKnowledgeBaseMutation.mutateAsync({
        id,
        question: q.trim(),
        answer: a.trim(),
      });

      setItems((prev) =>
        prev.map((i) => (i.id === id ? response.knowledgeBase : i))
      );

      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: KBId) => {
    try {
      setLoading(true);
      const response = await deleteKnowledgeBaseMutation.mutateAsync(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (error: any) {
      toast.error(error.messsage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarWithHeader title="Knowledge Base">
      <LoadingSpinner showLoadingSpinner={loading} />
      <Box p={6} height={"90vh"} overflowY="auto">
        <Heading size="lg" mb={2}>
          Knowledge Base
        </Heading>
        <Text mb={4} color="gray.600">
          Add, view, edit, and delete knowledge base articles.
        </Text>

        {/* Add Form */}
        <Box mb={6} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
          <Heading as="h3" size="sm" mb={3}>
            Add New Article
          </Heading>
          <Input
            placeholder="Enter question"
            mb={3}
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
          />
          <Textarea
            placeholder="Enter answer"
            mb={3}
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
          />
          <Flex align="center" gap={3}>
            <Button
              colorScheme="teal"
              onClick={handleAdd}
              isDisabled={!newQ.trim() || !newA.trim() || isDuplicate}
            >
              Add
            </Button>
            {isDuplicate && <Tag colorScheme="orange">Duplicate</Tag>}
          </Flex>
        </Box>

        <Divider mb={6} />

        {/* List */}
        <Heading as="h3" size="sm" mb={3}>
          All Articles
        </Heading>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text color="red.500">Error loading knowledge base</Text>
        ) : items.length === 0 ? (
          <Box
            p={6}
            borderWidth={1}
            borderRadius="md"
            textAlign="center"
            color="gray.500"
          >
            No articles yet.
          </Box>
        ) : (
          <Accordion allowMultiple>
            {items.map((item) => (
              <KnowledgeItem
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onStartEdit={(i) => setEditingId(i.id)}
                onCancelEdit={() => setEditingId(null)}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </Accordion>
        )}
      </Box>
    </SidebarWithHeader>
  );
};

export default KnowledgeBaseManager;
