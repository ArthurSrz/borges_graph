#!/usr/bin/env python3
"""Run full RAG comparison experiment.

Usage:
    python -m rag_comparison.run_experiment [--sample-size N] [--name NAME]

Examples:
    # Run on entire dataset
    python -m rag_comparison.run_experiment

    # Run on 10 samples for quick test
    python -m rag_comparison.run_experiment --sample-size 10

    # Run with custom experiment name
    python -m rag_comparison.run_experiment --name my_experiment
"""

from __future__ import annotations

import argparse
import asyncio
import logging
from datetime import datetime

from rag_comparison.clients.dust_client import DustClient
from rag_comparison.clients.mcp_client import MCPGraphRAGClient
from rag_comparison.config import ExperimentConfig
from rag_comparison.runner import ExperimentRunner


def setup_logging(verbose: bool = False) -> None:
    """Configure logging based on verbosity."""
    level = logging.INFO if verbose else logging.WARNING
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    # Suppress noisy loggers
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("LiteLLM").setLevel(logging.WARNING)


async def run_experiment(
    sample_size: int | None = None,
    experiment_name: str | None = None,
    verbose: bool = False,
) -> dict:
    """Run the full RAG comparison experiment.

    Args:
        sample_size: Number of samples to evaluate (None = all).
        experiment_name: Custom experiment name (auto-generated if None).
        verbose: Enable verbose logging.

    Returns:
        Dictionary with experiment results.
    """
    print("=" * 70)
    print("FULL RAG COMPARISON EXPERIMENT")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Load configuration
    config = ExperimentConfig.from_env()

    print(f"Dataset: civic-law-eval")
    print(f"Sample size: {sample_size or 'ALL'}")
    print(f"Metrics: {len(config.metrics)} configured")
    for m in config.metrics:
        print(f"  - {m}")
    print(f"Timeout: {config.timeout_seconds}s")
    print(f"LLM Judge: {'enabled' if config.enable_llm_judge else 'disabled'}")
    print()

    # Initialize clients
    dust_client = DustClient(
        api_key=config.dust_api_key,
        workspace_id=config.dust_workspace_id,
        agent_id=config.dust_agent_id,
        timeout=config.timeout_seconds,
    )

    graphrag_client = MCPGraphRAGClient(
        timeout=config.timeout_seconds,
    )

    # Create runner
    runner = ExperimentRunner(dust_client, graphrag_client, config)

    # Generate experiment name if not provided
    if experiment_name is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        experiment_name = f"full_comparison_{timestamp}"

    print("=" * 70)
    print(f"Experiment: {experiment_name}")
    print("=" * 70)
    print()
    print("Running experiment...")
    print("(This may take 30-60 minutes for the full dataset)")
    print()

    # Run experiment
    result = await runner.run_experiment(
        dataset_name="civic-law-eval",
        experiment_name=experiment_name,
        sample_size=sample_size,
    )

    # Print results
    print()
    print("=" * 70)
    print("FINAL RESULTS")
    print("=" * 70)
    print(f"Questions evaluated: {result['question_count']}")
    print()

    print("DUST RAG:")
    print(f"  Success rate:    {result['dust']['success_rate']*100:.1f}%")
    print(f"  Avg latency:     {result['dust']['avg_latency_ms']:,.0f}ms")
    print(f"  Min latency:     {result['dust']['min_latency_ms']:,.0f}ms")
    print(f"  Max latency:     {result['dust']['max_latency_ms']:,.0f}ms")
    print(f"  LLM precision:   {result['dust']['llm_precision']:.2f}")
    print()

    print("GRAPHRAG MCP:")
    print(f"  Success rate:    {result['graphrag']['success_rate']*100:.1f}%")
    print(f"  Avg latency:     {result['graphrag']['avg_latency_ms']:,.0f}ms")
    print(f"  Min latency:     {result['graphrag']['min_latency_ms']:,.0f}ms")
    print(f"  Max latency:     {result['graphrag']['max_latency_ms']:,.0f}ms")
    print(f"  LLM precision:   {result['graphrag']['llm_precision']:.2f}")
    print()

    # Calculate speedup
    if result["graphrag"]["avg_latency_ms"] > 0:
        speedup = result["dust"]["avg_latency_ms"] / result["graphrag"]["avg_latency_ms"]
        print(f"SPEEDUP: GraphRAG is {speedup:.1f}x faster than Dust")
    print()

    print(f"OPIK Dashboard: {result['opik_dashboard']}")
    print(f"Dust experiment: {result['dust_experiment']}")
    print(f"GraphRAG experiment: {result['graphrag_experiment']}")
    print()
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    return result


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Run RAG comparison experiment between Dust and GraphRAG",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m rag_comparison.run_experiment                    # Full dataset
  python -m rag_comparison.run_experiment --sample-size 10   # Quick test
  python -m rag_comparison.run_experiment --name my_exp      # Custom name
  python -m rag_comparison.run_experiment -v                 # Verbose mode
        """,
    )
    parser.add_argument(
        "--sample-size",
        "-n",
        type=int,
        default=None,
        help="Number of samples to evaluate (default: all)",
    )
    parser.add_argument(
        "--name",
        "-N",
        type=str,
        default=None,
        help="Custom experiment name (default: auto-generated)",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging",
    )

    args = parser.parse_args()

    setup_logging(args.verbose)

    asyncio.run(
        run_experiment(
            sample_size=args.sample_size,
            experiment_name=args.name,
            verbose=args.verbose,
        )
    )


if __name__ == "__main__":
    main()
